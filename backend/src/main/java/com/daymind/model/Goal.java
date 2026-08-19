package com.daymind.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String category; // ACADEMIC, WORK, HEALTH, PERSONAL, LEARNING
    private String icon; // emoji

    private int targetValue;       // e.g. 100 (pages, sessions, tasks)
    private int currentValue;      // real progress
    private String unit;           // "tasks", "pages", "sessions"

    private LocalDate deadline;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    // IDs of tasks linked to this goal
    @ElementCollection
    @CollectionTable(name = "goal_task_ids", joinColumns = @JoinColumn(name = "goal_id"))
    @Column(name = "task_id")
    private List<Long> linkedTaskIds = new ArrayList<>();

    public enum GoalStatus {
        ACTIVE, COMPLETED, PAUSED, ABANDONED
    }

    public Goal() {
        this.createdAt = LocalDateTime.now();
        this.status = GoalStatus.ACTIVE;
        this.icon = "🎯";
        this.currentValue = 0;
    }

    // Computed progress percentage
    public double getProgressPercent() {
        if (targetValue <= 0) return 0;
        return Math.min(100.0, (currentValue * 100.0) / targetValue);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getTargetValue() { return targetValue; }
    public void setTargetValue(int targetValue) { this.targetValue = targetValue; }

    public int getCurrentValue() { return currentValue; }
    public void setCurrentValue(int currentValue) { this.currentValue = currentValue; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }

    public List<Long> getLinkedTaskIds() { return linkedTaskIds; }
    public void setLinkedTaskIds(List<Long> linkedTaskIds) { this.linkedTaskIds = linkedTaskIds; }
}
