package com.daymind.factory;

import com.daymind.model.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TaskFactoryTest {

    @Test
    public void testAcademicTaskDurationPrediction() {
        BaseTask task = TaskFactory.createTask("Study Algorithms", "OOP Study", 60, 9, "Monday", Category.ACADEMIC, Priority.HIGH);
        assertTrue(task instanceof AcademicTask);
        assertEquals(75, task.getPredictedDurationMinutes());
        assertEquals(1.25, task.getCategoryMultiplier(), 0.01);
    }

    @Test
    public void testWorkTaskDurationPrediction() {
        BaseTask task = TaskFactory.createTask("API Refactoring", "Work", 45, 11, "Tuesday", Category.WORK, Priority.MEDIUM);
        assertTrue(task instanceof WorkTask);
        assertEquals(52, task.getPredictedDurationMinutes());
        assertEquals(1.15, task.getCategoryMultiplier(), 0.01);
    }

    @Test
    public void testHealthTaskDurationPrediction() {
        BaseTask task = TaskFactory.createTask("Morning Workout", "Gym", 45, 14, "Wednesday", Category.HEALTH, Priority.MEDIUM);
        assertTrue(task instanceof HealthTask);
        assertEquals(59, task.getPredictedDurationMinutes());
        assertEquals(1.30, task.getCategoryMultiplier(), 0.01);
    }

    @Test
    public void testPersonalTaskDurationPrediction() {
        BaseTask task = TaskFactory.createTask("Reading Book", "Read", 60, 18, "Thursday", Category.PERSONAL, Priority.LOW);
        assertTrue(task instanceof PersonalTask);
        assertEquals(57, task.getPredictedDurationMinutes());
        assertEquals(0.95, task.getCategoryMultiplier(), 0.01);
    }

    @Test
    public void testLearningTaskDurationPrediction() {
        BaseTask task = TaskFactory.createTask("Spring Boot Course", "Learn", 90, 10, "Friday", Category.LEARNING, Priority.HIGH);
        assertTrue(task instanceof LearningTask);
        assertEquals(108, task.getPredictedDurationMinutes());
        assertEquals(1.20, task.getCategoryMultiplier(), 0.01);
    }

    @Test
    public void testUrgentTaskPreemption() {
        BaseTask task = TaskFactory.createTask("Production Outage", "Fix server", 60, 9, "Monday", Category.URGENT, Priority.URGENT);
        assertTrue(task instanceof UrgentTask);
        assertEquals(Priority.URGENT, task.getPriority());
    }
}
