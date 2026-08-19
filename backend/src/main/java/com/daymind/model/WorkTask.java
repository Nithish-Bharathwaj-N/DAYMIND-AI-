package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("WORK")
public class WorkTask extends BaseTask {

    public WorkTask() {
        super();
    }

    public WorkTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, Category.WORK, priority);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 1.15; // +15% Work bias correction
    }

    @Override
    public double getPriorityWeight() {
        return getPriority() != null ? getPriority().getWeight() : 0.50;
    }

    @Override
    public double calculateFlexibilityScore(double completionProbability) {
        double prob = Math.max(completionProbability, 0.01);
        return (1.0 - getPriorityWeight()) / prob;
    }
}
