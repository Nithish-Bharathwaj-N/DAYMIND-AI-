package com.daymind.controller;

import com.daymind.model.FocusSession;
import com.daymind.service.FocusSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/focus-sessions")
@CrossOrigin(origins = "*")
public class FocusSessionController {

    @Autowired
    private FocusSessionService focusSessionService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> logSession(@RequestBody Map<String, Object> payload) {
        FocusSession session = focusSessionService.logSession(payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("session", session);
        response.put("message", String.format("✅ Focus session logged: %d mins on '%s'",
                session.getActualMinutes(), session.getTaskTitle()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodaySessions() {
        List<FocusSession> sessions = focusSessionService.getSessionsForDate(LocalDate.now());
        int totalMins = focusSessionService.getTodayFocusMinutes();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("sessions", sessions);
        response.put("totalMinutes", totalMins);
        response.put("totalHours", totalMins / 60.0);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklyStats() {
        Map<String, Integer> weekly = focusSessionService.getWeeklyFocusMinutes();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("weeklyMinutes", weekly);
        response.put("todayMinutes", focusSessionService.getTodayFocusMinutes());
        return ResponseEntity.ok(response);
    }
}
