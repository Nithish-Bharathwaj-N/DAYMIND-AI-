package com.daymind.controller;

import com.daymind.model.Habit;
import com.daymind.service.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    @Autowired
    private HabitService habitService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHabits() {
        List<Habit> habits = habitService.getAllHabits();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", habits.size());
        response.put("habits", habits);
        response.put("maxStreak", habitService.getMaxCurrentStreak());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createHabit(@RequestBody Map<String, Object> payload) {
        Habit habit = habitService.createHabit(payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("habit", habit);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateHabit(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Habit habit = habitService.updateHabit(id, payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("habit", habit);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleDate(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String dateStr = (payload != null) ? payload.get("date") : null;
        Habit habit = habitService.toggleHabitDate(id, dateStr);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("habit", habit);
        response.put("currentStreak", habit.getCurrentStreak());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Habit deleted.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<Map<String, Object>> archiveHabit(@PathVariable Long id) {
        Habit habit = habitService.archiveHabit(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("habit", habit);
        return ResponseEntity.ok(response);
    }
}
