package com.daymind.exception;

public class LLMInferenceException extends DayMindException {
    public LLMInferenceException(String message) {
        super("AI_INFERENCE_FAILURE", message);
    }
}
