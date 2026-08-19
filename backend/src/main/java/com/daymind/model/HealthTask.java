package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("HEALTH")
public class HealthTask extends BaseTask {

    public HealthTask() {
        super();
    }

    public HealthTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, Category.HEALTH, priority);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 1.30; // +30% Health bias correction (prep/recovery)
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
