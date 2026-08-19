package com.daymind.model;

public enum Priority {
    LOW(0.25, "Low Priority"),
    MEDIUM(0.50, "Medium Priority"),
    HIGH(0.75, "High Priority"),
    URGENT(1.00, "Urgent - Requires Immediate Slot Bumping");

    private final double weight;
    private final String description;

    Priority(double weight, String description) {
        this.weight = weight;
        this.description = description;
    }

    public double getWeight() {
        return weight;
    }

    public String getDescription() {
        return description;
    }
}
