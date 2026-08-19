package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ACADEMIC")
public class AcademicTask extends BaseTask {

    public AcademicTask() {
        super();
    }

    public AcademicTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, Category.ACADEMIC, priority);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 1.25; // +25% Academic bias correction
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
