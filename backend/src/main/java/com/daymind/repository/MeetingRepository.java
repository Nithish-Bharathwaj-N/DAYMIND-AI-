package com.daymind.repository;

import com.daymind.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByStatusOrderByMeetingDateDesc(Meeting.MeetingStatus status);
    List<Meeting> findByMeetingDateOrderByCreatedAtDesc(LocalDate date);
    List<Meeting> findAllByOrderByMeetingDateDescCreatedAtDesc();
}
