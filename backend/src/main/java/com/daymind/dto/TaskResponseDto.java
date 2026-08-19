package com.daymind.dto;

import com.daymind.model.BaseTask;
import com.daymind.model.Category;
import com.daymind.model.Priority;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class TaskResponseDto {
    private Long id;
    private String title;
    private String rawPrompt;
    private int userEstimatedMinutes;
    private int predictedDurationMinutes;
    private double polymorphicMultiplier;
    private int assignedHourSlot;
    private String dayOfWeek;
    private LocalDate scheduledDate;
    private boolean isScheduled;
    private boolean isCompleted;
    private Category category;
    private Priority priority;
    private double flexibilityScore;
    private String taskType;
    private String biasCorrectionNotice;
    private String bumpedNotice;

    public TaskResponseDto() {}

    public static TaskResponseDto fromEntity(BaseTask task, String bumpedNotice) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setRawPrompt(task.getRawPrompt());
        dto.setUserEstimatedMinutes(task.getUserEstimatedMinutes());
        dto.setPredictedDurationMinutes(task.getPredictedDurationMinutes());
        dto.setPolymorphicMultiplier(task.getCategoryMultiplier());
        dto.setAssignedHourSlot(task.getAssignedHourSlot());
        dto.setDayOfWeek(task.getDayOfWeek());
        dto.setScheduledDate(task.getScheduledDate());
        dto.setScheduled(task.isScheduled());
        dto.setCompleted(task.isCompleted());
        dto.setCategory(task.getCategory());
        dto.setPriority(task.getPriority());
        dto.setFlexibilityScore(task.getFlexibilityScore());
        dto.setTaskType(task.getClass().getSimpleName());
        
        double percent = (task.getCategoryMultiplier() - 1.0) * 100;
        if (percent > 0) {
            dto.setBiasCorrectionNotice(String.format("+%.0f%% Polymorphic Bias Correction Applied (%d min -> %d min)", percent, task.getUserEstimatedMinutes(), task.getPredictedDurationMinutes()));
        } else if (percent < 0) {
            dto.setBiasCorrectionNotice(String.format("%.0f%% Polymorphic Adjustment Applied (%d min -> %d min)", percent, task.getUserEstimatedMinutes(), task.getPredictedDurationMinutes()));
        } else {
            dto.setBiasCorrectionNotice(String.format("1:1 Exact Duration Allocation (%d min)", task.getUserEstimatedMinutes()));
        }
        dto.setBumpedNotice(bumpedNotice);
        return dto;
    }

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

    public double getPolymorphicMultiplier() { return polymorphicMultiplier; }
    public void setPolymorphicMultiplier(double polymorphicMultiplier) { this.polymorphicMultiplier = polymorphicMultiplier; }

    public int getAssignedHourSlot() { return assignedHourSlot; }
    public void setAssignedHourSlot(int assignedHourSlot) { this.assignedHourSlot = assignedHourSlot; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    @JsonProperty("isScheduled")
    public boolean isScheduled() { return isScheduled; }
    public void setScheduled(boolean scheduled) { isScheduled = scheduled; }

    @JsonProperty("isCompleted")
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public double getFlexibilityScore() { return flexibilityScore; }
    public void setFlexibilityScore(double flexibilityScore) { this.flexibilityScore = flexibilityScore; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getBiasCorrectionNotice() { return biasCorrectionNotice; }
    public void setBiasCorrectionNotice(String biasCorrectionNotice) { this.biasCorrectionNotice = biasCorrectionNotice; }

    public String getBumpedNotice() { return bumpedNotice; }
    public void setBumpedNotice(String bumpedNotice) { this.bumpedNotice = bumpedNotice; }
}
