package com.daymind.controller;

import com.daymind.model.Goal;
import com.daymind.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGoals() {
        List<Goal> goals = goalService.getAllGoals();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", goals.size());
        response.put("goals", goals);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveGoals() {
        List<Goal> goals = goalService.getActiveGoals();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("goals", goals);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createGoal(@RequestBody Map<String, Object> payload) {
        Goal goal = goalService.createGoal(payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("goal", goal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateGoal(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Goal goal = goalService.updateGoal(id, payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("goal", goal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Map<String, Object>> updateProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        int delta = payload.containsKey("delta") ? ((Number) payload.get("delta")).intValue() : 1;
        Goal goal = goalService.updateProgress(id, delta);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("goal", goal);
        response.put("progressPercent", goal.getProgressPercent());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Goal deleted.");
        return ResponseEntity.ok(response);
    }
}
