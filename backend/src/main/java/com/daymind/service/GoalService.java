package com.daymind.service;

import com.daymind.exception.InvalidTaskException;
import com.daymind.model.Goal;
import com.daymind.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    @Autowired
    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Goal> getActiveGoals() {
        return goalRepository.findByStatusOrderByDeadlineAsc(Goal.GoalStatus.ACTIVE);
    }

    public Goal createGoal(Map<String, Object> payload) {
        Goal goal = new Goal();
        goal.setTitle((String) payload.getOrDefault("title", "New Goal"));
        goal.setDescription((String) payload.getOrDefault("description", ""));
        goal.setCategory((String) payload.getOrDefault("category", "GENERAL"));
        goal.setIcon((String) payload.getOrDefault("icon", "🎯"));
        goal.setUnit((String) payload.getOrDefault("unit", "tasks"));

        if (payload.containsKey("targetValue")) {
            goal.setTargetValue(((Number) payload.get("targetValue")).intValue());
        } else {
            goal.setTargetValue(10);
        }

        if (payload.containsKey("deadline")) {
            try {
                goal.setDeadline(LocalDate.parse((String) payload.get("deadline")));
            } catch (Exception ignored) {}
        }

        return goalRepository.save(goal);
    }

    public Goal updateProgress(Long id, int delta) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Goal not found with ID: " + id));

        int newValue = Math.max(0, goal.getCurrentValue() + delta);
        goal.setCurrentValue(newValue);

        // Auto-complete if target reached
        if (newValue >= goal.getTargetValue()) {
            goal.setStatus(Goal.GoalStatus.COMPLETED);
        }

        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long id, Map<String, Object> payload) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Goal not found with ID: " + id));

        if (payload.containsKey("title")) goal.setTitle((String) payload.get("title"));
        if (payload.containsKey("description")) goal.setDescription((String) payload.get("description"));
        if (payload.containsKey("currentValue"))
            goal.setCurrentValue(((Number) payload.get("currentValue")).intValue());
        if (payload.containsKey("targetValue"))
            goal.setTargetValue(((Number) payload.get("targetValue")).intValue());
        if (payload.containsKey("icon")) goal.setIcon((String) payload.get("icon"));
        if (payload.containsKey("status")) {
            try {
                goal.setStatus(Goal.GoalStatus.valueOf((String) payload.get("status")));
            } catch (Exception ignored) {}
        }
        if (payload.containsKey("deadline")) {
            try {
                goal.setDeadline(LocalDate.parse((String) payload.get("deadline")));
            } catch (Exception ignored) {}
        }

        // Auto-complete check
        if (goal.getCurrentValue() >= goal.getTargetValue() && goal.getStatus() == Goal.GoalStatus.ACTIVE) {
            goal.setStatus(Goal.GoalStatus.COMPLETED);
        }

        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        if (!goalRepository.existsById(id)) {
            throw new InvalidTaskException("Goal not found with ID: " + id);
        }
        goalRepository.deleteById(id);
    }
}
