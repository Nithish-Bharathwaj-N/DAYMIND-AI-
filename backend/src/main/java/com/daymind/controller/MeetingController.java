package com.daymind.controller;

import com.daymind.model.Meeting;
import com.daymind.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMeetings() {
        List<Meeting> meetings = meetingService.getAllMeetings();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", meetings.size());
        response.put("meetings", meetings);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createMeeting(@RequestBody Map<String, Object> payload) {
        Meeting meeting = meetingService.createMeeting(payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("meeting", meeting);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<Map<String, Object>> analyzeMeeting(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String transcript = payload.getOrDefault("transcript", "");
        Map<String, Object> result = meetingService.analyzeTranscript(id, transcript);
        result.put("success", true);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/analyze-raw")
    public ResponseEntity<Map<String, Object>> analyzeRaw(@RequestBody Map<String, Object> payload) {
        // Legacy endpoint: create a temp meeting, analyze, return results
        Map<String, Object> meetingPayload = new HashMap<>();
        meetingPayload.put("title", payload.getOrDefault("title", "Quick Analysis"));
        meetingPayload.put("status", "COMPLETED");
        Meeting meeting = meetingService.createMeeting(meetingPayload);

        String transcript = (String) payload.getOrDefault("transcript", "");
        Map<String, Object> result = meetingService.analyzeTranscript(meeting.getId(), transcript);
        result.put("success", true);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/convert-action-items")
    public ResponseEntity<Map<String, Object>> convertActionItems(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> actionItems = (List<Map<String, Object>>) payload.getOrDefault("actionItems", List.of());
        Map<String, Object> result = meetingService.convertActionItemsToTasks(id, actionItems);
        return ResponseEntity.ok(result);
    }

    // Legacy flat endpoint still works
    @PostMapping("/convert-action-items")
    public ResponseEntity<Map<String, Object>> convertActionItemsLegacy(@RequestBody Map<String, Object> payload) {
        Long meetingId = payload.containsKey("meetingId") && payload.get("meetingId") != null
                ? ((Number) payload.get("meetingId")).longValue() : null;
        List<Map<String, Object>> actionItems = (List<Map<String, Object>>) payload.getOrDefault("actionItems", List.of());

        if (meetingId == null) {
            List<Meeting> meetings = meetingService.getAllMeetings();
            if (!meetings.isEmpty()) {
                meetingId = meetings.get(0).getId();
            } else {
                Map<String, Object> meetingPayload = new HashMap<>();
                meetingPayload.put("title", "Action Item Import");
                meetingPayload.put("status", "COMPLETED");
                Meeting meeting = meetingService.createMeeting(meetingPayload);
                meetingId = meeting.getId();
            }
        }
        Map<String, Object> result = meetingService.convertActionItemsToTasks(meetingId, actionItems);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Meeting deleted.");
        return ResponseEntity.ok(response);
    }
}
