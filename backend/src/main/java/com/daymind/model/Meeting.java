package com.daymind.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String platform; // Google Meet, Zoom, Teams

    @Column(length = 5000)
    private String transcript;

    @Column(length = 3000)
    private String summary;

    @ElementCollection
    @CollectionTable(name = "meeting_key_points", joinColumns = @JoinColumn(name = "meeting_id"))
    @Column(name = "key_point", length = 500)
    private List<String> keyPoints;

    @ElementCollection
    @CollectionTable(name = "meeting_decisions", joinColumns = @JoinColumn(name = "meeting_id"))
    @Column(name = "decision", length = 500)
    private List<String> decisions;

    @ElementCollection
    @CollectionTable(name = "meeting_participants", joinColumns = @JoinColumn(name = "meeting_id"))
    @Column(name = "participant")
    private List<String> participants;

    private LocalDate meetingDate;
    private String startTime;
    private String endTime;

    @Enumerated(EnumType.STRING)
    private MeetingStatus status;

    private boolean analyzed = false;
    private LocalDateTime createdAt;

    public enum MeetingStatus {
        UPCOMING, COMPLETED, CANCELLED
    }

    public Meeting() {
        this.createdAt = LocalDateTime.now();
        this.meetingDate = LocalDate.now();
        this.status = MeetingStatus.UPCOMING;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getKeyPoints() { return keyPoints; }
    public void setKeyPoints(List<String> keyPoints) { this.keyPoints = keyPoints; }

    public List<String> getDecisions() { return decisions; }
    public void setDecisions(List<String> decisions) { this.decisions = decisions; }

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }

    public LocalDate getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDate meetingDate) { this.meetingDate = meetingDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public MeetingStatus getStatus() { return status; }
    public void setStatus(MeetingStatus status) { this.status = status; }

    public boolean isAnalyzed() { return analyzed; }
    public void setAnalyzed(boolean analyzed) { this.analyzed = analyzed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
