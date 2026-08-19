package com.daymind.repository;

import com.daymind.model.BaseTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<BaseTask, Long> {
    List<BaseTask> findByDayOfWeek(String dayOfWeek);
    List<BaseTask> findByDayOfWeekAndAssignedHourSlot(String dayOfWeek, int assignedHourSlot);
}
