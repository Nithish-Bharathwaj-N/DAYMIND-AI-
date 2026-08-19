package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("GENERAL")
public class GeneralTask extends BaseTask {

    public GeneralTask() {
        super();
    }

    public GeneralTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Category category, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, category != null ? category : Category.OTHER, priority != null ? priority : Priority.MEDIUM);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 1.00;
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
