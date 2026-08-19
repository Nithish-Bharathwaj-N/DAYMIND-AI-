package com.daymind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("URGENT")
public class UrgentTask extends BaseTask {

    public UrgentTask() {
        super();
    }

    public UrgentTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Priority priority) {
        super(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, Category.URGENT, Priority.URGENT);
        updatePredictedDurationAndFlexibility();
    }

    @Override
    public double getCategoryMultiplier() {
        return 1.00; // Exact time allocation for critical emergency
    }

    @Override
    public double getPriorityWeight() {
        return 1.00; // Top priority weight for slot preemption
    }

    @Override
    public double calculateFlexibilityScore(double completionProbability) {
        // Zero flexibility: Urgent tasks preempt other scheduled slots
        return 0.0;
    }
}
