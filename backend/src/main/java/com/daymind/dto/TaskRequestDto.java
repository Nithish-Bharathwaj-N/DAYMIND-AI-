package com.daymind.dto;

import com.daymind.model.Category;
import com.daymind.model.Priority;

public class TaskRequestDto {
    private String title;
    private String rawPrompt;
    private Integer userEstimatedMinutes;
    private Integer assignedHourSlot; // e.g. 9 for 9 AM, 14 for 2 PM
    private String dayOfWeek; // e.g. "Monday"
    private Category category;
    private Priority priority;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRawPrompt() { return rawPrompt; }
    public void setRawPrompt(String rawPrompt) { this.rawPrompt = rawPrompt; }

    public Integer getUserEstimatedMinutes() { return userEstimatedMinutes; }
    public void setUserEstimatedMinutes(Integer userEstimatedMinutes) { this.userEstimatedMinutes = userEstimatedMinutes; }

    public Integer getAssignedHourSlot() { return assignedHourSlot; }
    public void setAssignedHourSlot(Integer assignedHourSlot) { this.assignedHourSlot = assignedHourSlot; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}
