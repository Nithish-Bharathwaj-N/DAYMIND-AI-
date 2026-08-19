package com.daymind.exception;

public class SlotConflictException extends DayMindException {
    public SlotConflictException(String message) {
        super("SLOT_CONFLICT_ERROR", message);
    }
}
