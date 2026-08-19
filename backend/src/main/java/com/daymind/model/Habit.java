package com.daymind.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String icon; // emoji icon
    private String color; // accent color

    @Enumerated(EnumType.STRING)
    private HabitFrequency frequency;

    // Completed dates stored as ISO strings
    @ElementCollection
    @CollectionTable(name = "habit_completed_dates", joinColumns = @JoinColumn(name = "habit_id"))
    @Column(name = "completed_date")
    private List<String> completedDates = new ArrayList<>();

    private int currentStreak;
    private int longestStreak;
    private LocalDateTime createdAt;
    private boolean archived = false;

    public enum HabitFrequency {
        DAILY, WEEKLY, WEEKDAYS
    }

    public Habit() {
        this.createdAt = LocalDateTime.now();
        this.frequency = HabitFrequency.DAILY;
        this.icon = "✅";
        this.color = "#6c5ce7";
    }

    // Business logic: toggle a date
    public boolean toggleDate(LocalDate date) {
        String dateStr = date.toString();
        if (completedDates.contains(dateStr)) {
            completedDates.remove(dateStr);
            return false;
        } else {
            completedDates.add(dateStr);
            return true;
        }
    }

    // Business logic: compute current streak from today backwards
    public void recomputeStreak() {
        int streak = 0;
        LocalDate day = LocalDate.now();
        while (completedDates.contains(day.toString())) {
            streak++;
            day = day.minusDays(1);
        }
        this.currentStreak = streak;
        if (streak > longestStreak) {
            this.longestStreak = streak;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public HabitFrequency getFrequency() { return frequency; }
    public void setFrequency(HabitFrequency frequency) { this.frequency = frequency; }

    public List<String> getCompletedDates() { return completedDates; }
    public void setCompletedDates(List<String> completedDates) { this.completedDates = completedDates; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) { this.archived = archived; }
}
