package com.daymind.strategy;

import com.daymind.factory.TaskFactory;
import com.daymind.model.BaseTask;
import com.daymind.model.Category;
import com.daymind.model.Priority;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class FlexibilityStrategyTest {

    private final FlexibilityBumpingStrategy strategy = new FlexibilityBumpingStrategy();

    @Test
    public void testFlexibilityScoreCalculation() {
        BaseTask lowPriorityTask = TaskFactory.createTask("Read Book", "Personal", 60, 10, "Monday", Category.PERSONAL, Priority.LOW);
        BaseTask highPriorityTask = TaskFactory.createTask("Deploy API", "Work", 60, 10, "Monday", Category.WORK, Priority.HIGH);

        lowPriorityTask.updatePredictedDurationAndFlexibility();
        highPriorityTask.updatePredictedDurationAndFlexibility();

        assertTrue(lowPriorityTask.getFlexibilityScore() > highPriorityTask.getFlexibilityScore(),
                "Low priority task should have a higher flexibility score than high priority task.");
    }

    @Test
    public void testBumpingSelection() {
        BaseTask urgentTask = TaskFactory.createTask("Production Crash", "Fix server", 60, 9, "Monday", Category.URGENT, Priority.URGENT);
        BaseTask normalTask = TaskFactory.createTask("Gym", "Health", 45, 9, "Monday", Category.HEALTH, Priority.LOW);

        urgentTask.updatePredictedDurationAndFlexibility();
        normalTask.updatePredictedDurationAndFlexibility();

        boolean canBump = strategy.canBumpExistingTask(urgentTask, normalTask);
        assertTrue(canBump, "Urgent task should be able to bump normal priority task.");
    }
}
