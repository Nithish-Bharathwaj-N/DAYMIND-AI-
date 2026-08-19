package com.daymind.repository;

import com.daymind.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByStatusOrderByDeadlineAsc(Goal.GoalStatus status);
    List<Goal> findAllByOrderByCreatedAtDesc();
}
