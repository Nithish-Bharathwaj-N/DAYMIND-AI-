package com.daymind.strategy;

import com.daymind.model.BaseTask;
import com.daymind.model.Priority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class FlexibilityBumpingStrategy implements SchedulingStrategy {

    @Override
    public boolean canBumpExistingTask(BaseTask incomingTask, BaseTask existingTask) {
        // Urgent tasks always bump non-urgent tasks
        if (incomingTask.getPriority() == Priority.URGENT && existingTask.getPriority() != Priority.URGENT) {
            return true;
        }

        // Compare flexibility scores: Lower score means higher priority / less flexible
        double incomingFlexibility = incomingTask.getFlexibilityScore();
        double existingFlexibility = existingTask.getFlexibilityScore();

        // If incoming task is less flexible (lower score), it can bump existing task
        return incomingFlexibility < existingFlexibility;
    }

    @Override
    public int findNextAvailableSlot(BaseTask task, List<BaseTask> dayTasks) {
        Set<Integer> occupiedSlots = dayTasks.stream()
                .filter(t -> !t.getId().equals(task.getId()))
                .map(BaseTask::getAssignedHourSlot)
                .collect(Collectors.toSet());

        // Search starting from current requested slot forward, then backward
        int targetSlot = task.getAssignedHourSlot();
        for (int offset = 1; offset < 12; offset++) {
            int nextSlot = targetSlot + offset;
            if (nextSlot <= 22 && !occupiedSlots.contains(nextSlot)) {
                return nextSlot;
            }
            int prevSlot = targetSlot - offset;
            if (prevSlot >= 8 && !occupiedSlots.contains(prevSlot)) {
                return prevSlot;
            }
        }
        return targetSlot + 1; // Fallback
    }
}
