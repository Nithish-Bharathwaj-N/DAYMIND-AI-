package com.daymind.service;

import com.daymind.model.BaseTask;
import com.daymind.model.FocusSession;
import com.daymind.repository.FocusSessionRepository;
import com.daymind.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public FocusSessionService(FocusSessionRepository focusSessionRepository, TaskRepository taskRepository) {
        this.focusSessionRepository = focusSessionRepository;
        this.taskRepository = taskRepository;
    }

    /**
     * Called when user ends a focus session (from FocusTimerModal).
     * Connects Focus Session -> Task Actual Duration -> Planning Fallacy Engine loop.
     */
    public FocusSession logSession(Map<String, Object> payload) {
        FocusSession session = new FocusSession();
        Long taskId = payload.containsKey("taskId") && payload.get("taskId") != null
                ? ((Number) payload.get("taskId")).longValue() : null;

        session.setTaskId(taskId);
        session.setTaskTitle((String) payload.getOrDefault("taskTitle", "Unnamed Task"));
        session.setTaskCategory((String) payload.getOrDefault("taskCategory", "OTHER"));
        session.setPlannedMinutes(payload.containsKey("plannedMinutes") ? ((Number) payload.get("plannedMinutes")).intValue() : 25);
        int actual = payload.containsKey("actualMinutes") ? ((Number) payload.get("actualMinutes")).intValue() : 0;
        session.setActualMinutes(actual);
        boolean isDone = payload.containsKey("completed") && (Boolean) payload.get("completed");
        session.setCompleted(isDone);
        session.setEndTime(LocalDateTime.now());

        FocusSession saved = focusSessionRepository.save(session);

        // Update task actual duration to complete the feedback loop
        if (taskId != null && actual > 0) {
            Optional<BaseTask> taskOpt = taskRepository.findById(taskId);
            if (taskOpt.isPresent()) {
                BaseTask task = taskOpt.get();
                task.setPredictedDurationMinutes(actual);
                if (isDone) task.setCompleted(true);
                taskRepository.save(task);
            }
        }

        return saved;
    }

    public List<FocusSession> getSessionsForDate(LocalDate date) {
        return focusSessionRepository.findBySessionDateOrderByStartTimeDesc(date);
    }

    public List<FocusSession> getSessionsForRange(LocalDate from, LocalDate to) {
        return focusSessionRepository.findBySessionDateBetweenOrderBySessionDateAsc(from, to);
    }

    /**
     * Total focus minutes for today — used in KpiCards "Focus Time" card.
     */
    public int getTodayFocusMinutes() {
        Integer result = focusSessionRepository.sumActualMinutesByDate(LocalDate.now());
        return result != null ? result : 0;
    }

    /**
     * Focus minutes per day for the last 7 days — used in ProductivityTrendChart.
     */
    public Map<String, Integer> getWeeklyFocusMinutes() {
        LocalDate today = LocalDate.now();
        Map<String, Integer> result = new java.util.LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            Integer mins = focusSessionRepository.sumActualMinutesByDate(day);
            result.put(day.toString(), mins != null ? mins : 0);
        }
        return result;
    }
}
