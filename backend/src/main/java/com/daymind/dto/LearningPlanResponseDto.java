package com.daymind.dto;

import java.util.List;

public class LearningPlanResponseDto {
    private String topic;
    private int totalDays;
    private int totalModules;
    private List<DailyModuleDto> modules;
    private String roadmapSummary;

    public static class DailyModuleDto {
        private String dayOfWeek; // e.g. "Monday"
        private int dayNumber;
        private String moduleTitle;
        private String description;
        private int durationMinutes;
        private int suggestedHourSlot;

        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

        public int getDayNumber() { return dayNumber; }
        public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

        public String getModuleTitle() { return moduleTitle; }
        public void setModuleTitle(String moduleTitle) { this.moduleTitle = moduleTitle; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public int getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

        public int getSuggestedHourSlot() { return suggestedHourSlot; }
        public void setSuggestedHourSlot(int suggestedHourSlot) { this.suggestedHourSlot = suggestedHourSlot; }
    }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }

    public int getTotalModules() { return totalModules; }
    public void setTotalModules(int totalModules) { this.totalModules = totalModules; }

    public List<DailyModuleDto> getModules() { return modules; }
    public void setModules(List<DailyModuleDto> modules) { this.modules = modules; }

    public String getRoadmapSummary() { return roadmapSummary; }
    public void setRoadmapSummary(String roadmapSummary) { this.roadmapSummary = roadmapSummary; }
}
