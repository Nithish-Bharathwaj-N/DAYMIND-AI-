package com.daymind.exception;

public class DayMindException extends RuntimeException {
    private final String errorCode;

    public DayMindException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public DayMindException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
