package com.daymind.repository;

import com.daymind.model.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findBySessionDateOrderByStartTimeDesc(LocalDate date);
    List<FocusSession> findBySessionDateBetweenOrderBySessionDateAsc(LocalDate from, LocalDate to);

    @Query("SELECT SUM(f.actualMinutes) FROM FocusSession f WHERE f.sessionDate = :date")
    Integer sumActualMinutesByDate(LocalDate date);

    @Query("SELECT SUM(f.actualMinutes) FROM FocusSession f WHERE f.sessionDate BETWEEN :from AND :to")
    Integer sumActualMinutesBetween(LocalDate from, LocalDate to);
}
