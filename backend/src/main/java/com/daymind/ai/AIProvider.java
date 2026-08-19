package com.daymind.ai;

import java.util.List;
import java.util.Map;

public interface AIProvider {
    
    Map<String, Object> classifyAndParseTask(String rawPrompt);
    
    Map<String, Object> summarizeMeeting(String title, String transcript);
    
    Map<String, Object> optimizeDaySchedule(List<Map<String, Object>> currentTasks);
    
    String generateAssistantResponse(String userQuery, Map<String, Object> appContext);
}
