package com.daymind.factory;

import com.daymind.model.*;

import com.daymind.exception.InvalidTaskException;

public class TaskFactory {

    /**
     * Factory Method (Core Java Design Pattern)
     * Polymorphically instantiates concrete subclasses of BaseTask based on Category & Priority.
     */
    public static BaseTask createTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Category category, Priority priority) {
        if (title == null || title.trim().isEmpty()) {
            throw new InvalidTaskException("Task title cannot be empty or null.");
        }
        if (userEstimatedMinutes <= 0) {
            throw new InvalidTaskException("User estimated duration must be greater than 0 minutes.");
        }
        if (assignedHourSlot < 0 || assignedHourSlot > 23) {
            throw new InvalidTaskException("Assigned hour slot must be between 0 and 23.");
        }

        if (priority == Priority.URGENT || category == Category.URGENT) {
            return new UrgentTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
        }

        if (category == null) {
            category = Category.OTHER;
        }

        switch (category) {
            case ACADEMIC:
                return new AcademicTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
            case WORK:
                return new WorkTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
            case HEALTH:
                return new HealthTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
            case PERSONAL:
                return new PersonalTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
            case LEARNING:
                return new LearningTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, priority);
            case OTHER:
            default:
                return new GeneralTask(title, rawPrompt, userEstimatedMinutes, assignedHourSlot, dayOfWeek, category, priority);
        }
    }
}
