package com.daymind.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DayMindException.class)
    public ResponseEntity<Map<String, Object>> handleDayMindException(DayMindException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("errorCode", ex.getErrorCode());
        body.put("message", ex.getMessage());
        
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (ex instanceof LLMInferenceException) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("errorCode", "INTERNAL_SERVER_ERROR");
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred.");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
