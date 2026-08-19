package com.daymind.intelligence;

import com.daymind.model.BaseTask;
import com.daymind.model.Category;
import com.daymind.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * PlanningFallacyEngine — Intelligence Engine v2
 * Evaluates completed tasks, calculates estimation accuracy metrics,
 * category bias trends, and overall planning fallacy scores.
 */
@Service
public class PlanningFallacyEngine {

    private final TaskRepository taskRepository;

    @Autowired
    public PlanningFallacyEngine(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Map<String, Object> calculateFallacyMetrics() {
        List<BaseTask> completedTasks = taskRepository.findAll().stream()
                .filter(BaseTask::isCompleted)
                .collect(Collectors.toList());

        Map<String, Object> metrics = new HashMap<>();

        if (completedTasks.isEmpty()) {
            metrics.put("hasSufficientData", false);
            metrics.put("planningAccuracyScore", 82);
            metrics.put("averageBiasPercent", "+18%");
            metrics.put("summaryText", "Baseline model active. Complete focus sessions to build your personalized accuracy curve.");
            metrics.put("categoryBiases", Map.of("WORK", "+31%", "ACADEMIC", "+23%", "LEARNING", "+18%"));
            return metrics;
        }

        int totalTasks = completedTasks.size();
        double totalErrorMins = 0;
        double totalErrorPctSum = 0;

        Map<Category, List<Double>> categoryRatios = new HashMap<>();

        for (BaseTask task : completedTasks) {
            int est = Math.max(1, task.getUserEstimatedMinutes());
            int actual = task.getPredictedDurationMinutes() > 0
                    ? task.getPredictedDurationMinutes()
                    : est;

            double errorMins = actual - est;
            double errorPct = (errorMins / est) * 100.0;

            totalErrorMins += errorMins;
            totalErrorPctSum += errorPct;

            Category cat = task.getCategory() != null ? task.getCategory() : Category.OTHER;
            categoryRatios.computeIfAbsent(cat, k -> new ArrayList<>()).add((double) actual / est);
        }

        double avgErrorPct = totalErrorPctSum / totalTasks;
        int accuracyScore = Math.max(30, Math.min(100, (int) Math.round(100 - Math.abs(avgErrorPct) * 0.8)));

        Map<String, String> categoryBiasesStr = new HashMap<>();
        categoryRatios.forEach((cat, ratios) -> {
            double avgRatio = ratios.stream().mapToDouble(r -> r).average().orElse(1.0);
            int pct = (int) Math.round((avgRatio - 1.0) * 100);
            categoryBiasesStr.put(cat.name(), (pct >= 0 ? "+" : "") + pct + "%");
        });

        metrics.put("hasSufficientData", true);
        metrics.put("completedTaskCount", totalTasks);
        metrics.put("planningAccuracyScore", accuracyScore);
        metrics.put("averageBiasPercent", String.format("%s%.1f%%", avgErrorPct >= 0 ? "+" : "", avgErrorPct));
        metrics.put("categoryBiases", categoryBiasesStr);
        metrics.put("summaryText", accuracyScore >= 75
                ? "Your time estimates are becoming highly accurate. Great job!"
                : "DayMind automatically buffers your tasks to protect deadlines.");

        return metrics;
    }
}
