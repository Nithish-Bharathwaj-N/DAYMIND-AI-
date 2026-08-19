package com.daymind.model;

public enum Category {
    ACADEMIC("Academic", 1.25, "+25% Bias Correction"),
    WORK("Work", 1.15, "+15% Bias Correction"),
    HEALTH("Health & Wellness", 1.30, "+30% Bias Correction"),
    PERSONAL("Personal", 0.95, "-5% Adjustment"),
    URGENT("Urgent Priority", 1.00, "Top Priority Bumping"),
    LEARNING("Learning & Skill", 1.20, "+20% Skill Ramp"),
    OTHER("General Task", 1.00, "Standard Estimate");

    private final String displayName;
    private final double defaultMultiplier;
    private final String description;

    Category(String displayName, double defaultMultiplier, String description) {
        this.displayName = displayName;
        this.defaultMultiplier = defaultMultiplier;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getDefaultMultiplier() {
        return defaultMultiplier;
    }

    public String getDescription() {
        return description;
    }
}
