package com.daymind.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "task_type", discriminatorType = DiscriminatorType.STRING)
public abstract class BaseTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String rawPrompt;

    @Column(nullable = false)
    private int userEstimatedMinutes;

    @Column(nullable = false)
    private int predictedDurationMinutes;

    @Column(nullable = false)
    private int assignedHourSlot;

    @Column(nullable = false)
    private String dayOfWeek;

    @Column(nullable = false)
    private boolean isScheduled;

    @Column(nullable = false)
    private boolean isCompleted = false;

    private LocalDateTime createdAt;
    private LocalDateTime scheduledAt;

    private LocalDate scheduledDate;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private double completionProbability = 0.75;
    private double flexibilityScore;

    public BaseTask() {
        this.createdAt = LocalDateTime.now();
        this.isScheduled = false;
        this.scheduledDate = LocalDate.now();
    }

    public BaseTask(String title, String rawPrompt, int userEstimatedMinutes, int assignedHourSlot, String dayOfWeek, Category category, Priority priority) {
        this();
        this.title = title;
        this.rawPrompt = rawPrompt;
        this.userEstimatedMinutes = userEstimatedMinutes;
        this.assignedHourSlot = assignedHourSlot;
        this.dayOfWeek = dayOfWeek != null ? dayOfWeek : "Monday";
        this.category = category;
        this.priority = priority;
    }

    // Mandatory Abstract Methods (Core Java OOP Evaluation Criteria)
    public abstract double getCategoryMultiplier();
    public abstract double getPriorityWeight();
    public abstract double calculateFlexibilityScore(double completionProbability);

    public void updatePredictedDurationAndFlexibility() {
        double multiplier = getCategoryMultiplier();
        this.predictedDurationMinutes = (int) Math.round(this.userEstimatedMinutes * multiplier);
        this.flexibilityScore = calculateFlexibilityScore(this.completionProbability);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRawPrompt() { return rawPrompt; }
    public void setRawPrompt(String rawPrompt) { this.rawPrompt = rawPrompt; }

    public int getUserEstimatedMinutes() { return userEstimatedMinutes; }
    public void setUserEstimatedMinutes(int userEstimatedMinutes) { this.userEstimatedMinutes = userEstimatedMinutes; }

    public int getPredictedDurationMinutes() { return predictedDurationMinutes; }
    public void setPredictedDurationMinutes(int predictedDurationMinutes) { this.predictedDurationMinutes = predictedDurationMinutes; }

    public int getAssignedHourSlot() { return assignedHourSlot; }
    public void setAssignedHourSlot(int assignedHourSlot) { this.assignedHourSlot = assignedHourSlot; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public boolean isScheduled() { return isScheduled; }
    public void setScheduled(boolean scheduled) { isScheduled = scheduled; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public double getCompletionProbability() { return completionProbability; }
    public void setCompletionProbability(double completionProbability) { this.completionProbability = completionProbability; }

    public double getFlexibilityScore() { return flexibilityScore; }
    public void setFlexibilityScore(double flexibilityScore) { this.flexibilityScore = flexibilityScore; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
