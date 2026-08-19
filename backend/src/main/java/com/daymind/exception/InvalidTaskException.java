package com.daymind.exception;

public class InvalidTaskException extends DayMindException {
    public InvalidTaskException(String message) {
        super("INVALID_TASK_PAYLOAD", message);
    }
}
