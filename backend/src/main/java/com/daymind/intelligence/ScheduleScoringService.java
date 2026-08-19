package com.daymind.intelligence;

import com.daymind.model.BaseTask;
import com.daymind.model.Priority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * ScheduleScoringService — Intelligence Engine v2
 * Evaluates candidate time slots using a multi-factor scoring formula:
 * SlotScore = PriorityScore + DeadlineScore + EnergyAlignmentScore + CompletionProb - Penalties
 */
@Service
public class ScheduleScoringService {

    private final EnergyAlignmentService energyAlignmentService;

    @Autowired
    public ScheduleScoringService(EnergyAlignmentService energyAlignmentService) {
        this.energyAlignmentService = energyAlignmentService;
    }

    public SlotScoreResult scoreSlot(BaseTask task, int candidateHourSlot) {
        // 1. Priority Score (0 - 40 pts)
        int priorityScore = 15;
        if (task.getPriority() == Priority.URGENT) priorityScore = 40;
        else if (task.getPriority() == Priority.HIGH) priorityScore = 30;
        else if (task.getPriority() == Priority.MEDIUM) priorityScore = 20;

        // 2. Energy Alignment Score (0 - 30 pts)
        int energyCompat = energyAlignmentService.calculateEnergyCompatibility(task.getCategory(), candidateHourSlot);
        int energyScore = (int) Math.round((energyCompat / 100.0) * 30);

        // 3. Deadline Proximity Score (0 - 20 pts)
        int deadlineScore = 10;
        if (task.getPriority() == Priority.URGENT || (task.getDayOfWeek() != null && task.getDayOfWeek().equalsIgnoreCase("Today"))) {
            deadlineScore = 20;
        }

        // 4. Completion Probability Heuristic (0 - 10 pts)
        int completionProbScore = candidateHourSlot >= 8 && candidateHourSlot <= 12 ? 10 : 7;

        // 5. Context Switch Penalty
        int penalty = candidateHourSlot >= 17 ? 5 : 0;

        int totalScore = priorityScore + energyScore + deadlineScore + completionProbScore - penalty;

        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("PriorityScore", priorityScore);
        breakdown.put("EnergyAlignmentScore", energyScore);
        breakdown.put("DeadlineScore", deadlineScore);
        breakdown.put("CompletionProbabilityScore", completionProbScore);
        breakdown.put("ContextSwitchPenalty", penalty);

        String explanation = String.format(
                "Score: %d/100 (Priority: +%d, Energy: +%d, Deadline: +%d, Peak Window: +%d)",
                totalScore, priorityScore, energyScore, deadlineScore, completionProbScore
        );

        return new SlotScoreResult(candidateHourSlot, totalScore, breakdown, explanation);
    }

    public static class SlotScoreResult {
        private final int hourSlot;
        private final int totalScore;
        private final Map<String, Integer> breakdown;
        private final String explanation;

        public SlotScoreResult(int hourSlot, int totalScore, Map<String, Integer> breakdown, String explanation) {
            this.hourSlot = hourSlot;
            this.totalScore = totalScore;
            this.breakdown = breakdown;
            this.explanation = explanation;
        }

        public int getHourSlot() { return hourSlot; }
        public int getTotalScore() { return totalScore; }
        public Map<String, Integer> getBreakdown() { return breakdown; }
        public String getExplanation() { return explanation; }
    }
}
