package com.daymind.dto;

import java.util.Map;

public class AnalyticsResponseDto {
    private int totalTasks;
    private int completedTasks;
    private double completionPercentage;
    private int totalUserEstimatedMinutes;
    private int totalPredictedDurationMinutes;
    private int extraBufferMinutesAdded;
    private double planningFallacyReductionScore;
    private Map<String, Integer> categoryMinutesBreakdown;
    private Map<String, Integer> categoryTaskCounts;

    public int getTotalTasks() { return totalTasks; }
    public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }

    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }

    public int getTotalUserEstimatedMinutes() { return totalUserEstimatedMinutes; }
    public void setTotalUserEstimatedMinutes(int totalUserEstimatedMinutes) { this.totalUserEstimatedMinutes = totalUserEstimatedMinutes; }

    public int getTotalPredictedDurationMinutes() { return totalPredictedDurationMinutes; }
    public void setTotalPredictedDurationMinutes(int totalPredictedDurationMinutes) { this.totalPredictedDurationMinutes = totalPredictedDurationMinutes; }

    public int getExtraBufferMinutesAdded() { return extraBufferMinutesAdded; }
    public void setExtraBufferMinutesAdded(int extraBufferMinutesAdded) { this.extraBufferMinutesAdded = extraBufferMinutesAdded; }

    public double getPlanningFallacyReductionScore() { return planningFallacyReductionScore; }
    public void setPlanningFallacyReductionScore(double planningFallacyReductionScore) { this.planningFallacyReductionScore = planningFallacyReductionScore; }

    public Map<String, Integer> getCategoryMinutesBreakdown() { return categoryMinutesBreakdown; }
    public void setCategoryMinutesBreakdown(Map<String, Integer> categoryMinutesBreakdown) { this.categoryMinutesBreakdown = categoryMinutesBreakdown; }

    public Map<String, Integer> getCategoryTaskCounts() { return categoryTaskCounts; }
    public void setCategoryTaskCounts(Map<String, Integer> categoryTaskCounts) { this.categoryTaskCounts = categoryTaskCounts; }
}
