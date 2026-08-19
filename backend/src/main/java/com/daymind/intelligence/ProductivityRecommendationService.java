package com.daymind.intelligence;

import com.daymind.model.BaseTask;
import com.daymind.model.Priority;
import com.daymind.repository.TaskRepository;
import com.daymind.service.FocusSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ProductivityRecommendationService — Intelligence Engine v2
 * Generates the AI Day Brief, calculates the Schedule Health Score (0-100),
 * and provides contextual recommendations based on actual DB data.
 */
@Service
public class ProductivityRecommendationService {

    private final TaskRepository taskRepository;
    private final FocusSessionService focusSessionService;
    private final PlanningFallacyEngine planningFallacyEngine;

    @Autowired
    public ProductivityRecommendationService(TaskRepository taskRepository,
                                             FocusSessionService focusSessionService,
                                             PlanningFallacyEngine planningFallacyEngine) {
        this.taskRepository = taskRepository;
        this.focusSessionService = focusSessionService;
        this.planningFallacyEngine = planningFallacyEngine;
    }

    public Map<String, Object> generateDayBrief() {
        LocalDate today = LocalDate.now();
        List<BaseTask> allTasks = taskRepository.findAll();
        List<BaseTask> todayTasks = allTasks.stream()
                .filter(t -> today.equals(t.getScheduledDate()))
                .collect(Collectors.toList());

        List<BaseTask> pending = todayTasks.stream().filter(t -> !t.isCompleted()).collect(Collectors.toList());
        List<BaseTask> completed = todayTasks.stream().filter(BaseTask::isCompleted).collect(Collectors.toList());

        int totalPlannedMins = todayTasks.stream()
                .mapToInt(t -> t.getPredictedDurationMinutes() > 0 ? t.getPredictedDurationMinutes() : t.getUserEstimatedMinutes())
                .sum();

        int plannedHours = totalPlannedMins / 60;
        int plannedMins = totalPlannedMins % 60;

        // Schedule Health Score Calculation
        int healthScore = 100;
        List<String> reasonsPositive = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        long urgentCount = pending.stream().filter(t -> t.getPriority() == Priority.URGENT).count();
        if (urgentCount > 0) {
            healthScore -= (int) (urgentCount * 15);
            warnings.add(urgentCount + " urgent task(s) pending");
        } else {
            reasonsPositive.add("No urgent deadline pressure");
        }

        int todayFocusMins = focusSessionService.getTodayFocusMinutes();
        if (todayFocusMins >= 120) {
            reasonsPositive.add("Strong focus time completed (" + todayFocusMins + "m)");
        } else {
            warnings.add("Focus time below target (" + todayFocusMins + "m / 360m goal)");
        }

        if (totalPlannedMins > 480) { // > 8 hours planned
            healthScore -= 20;
            warnings.add("Overloaded day schedule (" + plannedHours + "h " + plannedMins + "m planned)");
        } else {
            reasonsPositive.add("Workload within healthy 8-hour limit");
        }

        healthScore = Math.max(30, Math.min(100, healthScore));

        Map<String, Object> brief = new HashMap<>();
        brief.put("plannedTimeFormatted", plannedHours + "h " + plannedMins + "m");
        brief.put("todayTaskCount", todayTasks.size());
        brief.put("pendingCount", pending.size());
        brief.put("completedCount", completed.size());
        brief.put("scheduleHealthScore", healthScore);
        brief.put("healthStatus", healthScore >= 80 ? "EXCELLENT" : healthScore >= 60 ? "GOOD" : "NEEDS_OPTIMIZATION");
        brief.put("positiveFactors", reasonsPositive);
        brief.put("warnings", warnings);
        brief.put("peakFocusWindow", "9:00 AM – 11:30 AM");
        brief.put("planningFallacyMetrics", planningFallacyEngine.calculateFallacyMetrics());

        return brief;
    }
}
