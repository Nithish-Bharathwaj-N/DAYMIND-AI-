package com.daymind.dto;

public class LearningPlanRequestDto {
    private String topic;
    private Integer targetDays; // e.g. 5 or 7 days
    private Integer hoursPerDay; // e.g. 2 hours
    private String skillLevel; // e.g. "Beginner", "Intermediate", "Advanced"

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Integer getTargetDays() { return targetDays; }
    public void setTargetDays(Integer targetDays) { this.targetDays = targetDays; }

    public Integer getHoursPerDay() { return hoursPerDay; }
    public void setHoursPerDay(Integer hoursPerDay) { this.hoursPerDay = hoursPerDay; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
}
