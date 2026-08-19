package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PERSONAL")
public class PersonalTask extends BaseTask {

    public PersonalTask() {
        super();
    }

    public PersonalTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, Category.PERSONAL, priority);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 0.95; // -5% Personal task adjustment
    }

    @Override
    public double getPriorityWeight() {
        return getPriority() != null ? getPriority().getWeight() : 0.25;
    }

    @Override
    public double calculateFlexibilityScore(double completionProbability) {
        double prob = Math.max(completionProbability, 0.01);
        return (1.0 - getPriorityWeight()) / prob;
    }
}
