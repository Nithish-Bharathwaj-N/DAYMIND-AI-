package com.daymind.ai;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class MeetingAnalysisTest {

    private final MockAIProvider aiProvider = new MockAIProvider();

    @Test
    public void testMeetingSummarizationAndActionItemExtraction() {
        String transcript = "John will prepare the API documentation by Friday. Sarah will review the database schema tomorrow.";
        Map<String, Object> result = aiProvider.summarizeMeeting("Architecture Sync", transcript);

        assertNotNull(result);
        assertEquals("Architecture Sync", result.get("meetingTitle"));
        assertTrue(result.containsKey("summary"));
        assertTrue(result.containsKey("keyPoints"));
        assertTrue(result.containsKey("decisions"));

        List<Map<String, Object>> actionItems = (List<Map<String, Object>>) result.get("actionItems");
        assertNotNull(actionItems);
        assertFalse(actionItems.isEmpty(), "Meeting analysis must extract action items.");
    }
}
