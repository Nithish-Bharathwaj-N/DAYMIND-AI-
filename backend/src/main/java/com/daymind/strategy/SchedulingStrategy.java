package com.daymind.strategy;

import com.daymind.model.BaseTask;
import java.util.List;

public interface SchedulingStrategy {
    
    /**
     * Strategy interface for slot allocation & conflict resolution
     */
    boolean canBumpExistingTask(BaseTask incomingTask, BaseTask existingTask);
    
    int findNextAvailableSlot(BaseTask task, List<BaseTask> dayTasks);
}
