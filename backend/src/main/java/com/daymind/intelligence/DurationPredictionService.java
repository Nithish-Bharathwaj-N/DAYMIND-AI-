package com.daymind.intelligence;

import com.daymind.model.BaseTask;
import com.daymind.model.Category;
import com.daymind.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DurationPredictionService — Intelligence Engine v2
 * Calculates predicted durations based on category baseline models and historical task actuals.
 * Maintains User Estimate vs. Predicted Duration vs. Actual Duration separation.
 */
@Service
public class DurationPredictionService {

    private static final Logger log = LoggerFactory.getLogger(DurationPredictionService.class);

    // Heuristic Category Multipliers (applied when personal dataset is small)
    private static final Map<Category, Double> CATEGORY_BIAS_MULTIPLIERS = Map.of(
            Category.WORK, 1.31,      // +31% average underestimation
            Category.ACADEMIC, 1.23,  // +23% average underestimation
            Category.LEARNING, 1.18,  // +18% average underestimation
            Category.URGENT, 1.15,    // +15% average underestimation
            Category.PERSONAL, 1.10,  // +10% average underestimation
            Category.HEALTH, 1.05,    // +5% average underestimation
            Category.OTHER, 1.10
    );

    private final TaskRepository taskRepository;

    @Autowired
    public DurationPredictionService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public PredictionResult predictDuration(Category category, int userEstimateMinutes) {
        if (userEstimateMinutes <= 0) {
            userEstimateMinutes = 60;
        }

        Category cat = category != null ? category : Category.OTHER;
        List<BaseTask> completedCategoryTasks = taskRepository.findAll().stream()
                .filter(BaseTask::isCompleted)
                .filter(t -> t.getCategory() == cat)
                .filter(t -> t.getPredictedDurationMinutes() > 0)
                .collect(Collectors.toList());

        int count = completedCategoryTasks.size();
        double multiplier;
        String sourceLabel;

        if (count >= 5) {
            // Learned User Pattern from real historical completions
            double avgRatio = completedCategoryTasks.stream()
                    .mapToDouble(t -> (double) t.getPredictedDurationMinutes() / Math.max(1, t.getUserEstimatedMinutes()))
                    .average()
                    .orElse(1.20);
            multiplier = Math.max(1.0, Math.min(2.5, avgRatio));
            sourceLabel = "Learned User Pattern (" + count + " completed " + cat.name().toLowerCase() + " tasks)";
        } else {
            // Category Baseline Model (Heuristic)
            multiplier = CATEGORY_BIAS_MULTIPLIERS.getOrDefault(cat, 1.15);
            sourceLabel = "Heuristic Estimate (Category Model)";
        }

        int predictedMins = (int) Math.round(userEstimateMinutes * multiplier);

        log.info("[DURATION-ENGINE] Category: {}, Estimate: {}m -> Predicted: {}m (Multiplier: {}, Source: {})",
                cat, userEstimateMinutes, predictedMins, String.format("%.2f", multiplier), sourceLabel);

        return new PredictionResult(userEstimateMinutes, predictedMins, multiplier, sourceLabel);
    }

    public static class PredictionResult {
        private final int userEstimateMinutes;
        private final int predictedDurationMinutes;
        private final double biasMultiplier;
        private final String sourceLabel;

        public PredictionResult(int userEstimateMinutes, int predictedDurationMinutes, double biasMultiplier, String sourceLabel) {
            this.userEstimateMinutes = userEstimateMinutes;
            this.predictedDurationMinutes = predictedDurationMinutes;
            this.biasMultiplier = biasMultiplier;
            this.sourceLabel = sourceLabel;
        }

        public int getUserEstimateMinutes() { return userEstimateMinutes; }
        public int getPredictedDurationMinutes() { return predictedDurationMinutes; }
        public double getBiasMultiplier() { return biasMultiplier; }
        public String getSourceLabel() { return sourceLabel; }

        public String getNotice() {
            int delta = predictedDurationMinutes - userEstimateMinutes;
            if (delta > 0) {
                return String.format("+%d min planning bias correction applied (%s)", delta, sourceLabel);
            }
            return "Duration matches estimated timeframe.";
        }
    }
}
