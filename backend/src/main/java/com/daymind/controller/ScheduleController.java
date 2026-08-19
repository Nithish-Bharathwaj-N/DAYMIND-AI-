package com.daymind.controller;

import com.daymind.dto.*;
import com.daymind.intelligence.*;
import com.daymind.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ScheduleController: Core task scheduling REST API.
 * Demonstrates: @RestController, @CrossOrigin, dependency injection, REST patterns.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleChangeAuditService scheduleChangeAuditService;
    private final ProductivityRecommendationService productivityRecommendationService;
    private final PlanningFallacyEngine planningFallacyEngine;

    @Autowired
    public ScheduleController(ScheduleService scheduleService,
                               ScheduleChangeAuditService scheduleChangeAuditService,
                               ProductivityRecommendationService productivityRecommendationService,
                               PlanningFallacyEngine planningFallacyEngine) {
        this.scheduleService = scheduleService;
        this.scheduleChangeAuditService = scheduleChangeAuditService;
        this.productivityRecommendationService = productivityRecommendationService;
        this.planningFallacyEngine = planningFallacyEngine;
    }

    /** Create and schedule a task through the Java OOP engine */
    @PostMapping("/schedule/task")
    public ResponseEntity<Map<String, Object>> scheduleSingleTask(@RequestBody TaskRequestDto dto) {
        TaskResponseDto responseDto = scheduleService.scheduleTask(dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task processed through Core Java OOP Engine successfully.");
        response.put("task", responseDto);
        return ResponseEntity.ok(response);
    }

    /** Get all scheduled tasks */
    @GetMapping("/schedule/slots")
    public ResponseEntity<Map<String, Object>> getScheduledSlots() {
        List<TaskResponseDto> tasks = scheduleService.getAllScheduledSlots();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", tasks.size());
        response.put("tasks", tasks);
        return ResponseEntity.ok(response);
    }

    /** Alias: /api/tasks → same as /api/schedule/slots (used by frontend) */
    @GetMapping("/tasks")
    public ResponseEntity<Map<String, Object>> getTasksAlias() {
        return getScheduledSlots();
    }

    /** Returns only today's scheduled tasks for the command center timeline */
    @GetMapping("/schedule/today")
    public ResponseEntity<Map<String, Object>> getTodayTasks() {
        List<TaskResponseDto> tasks = scheduleService.getTodayTasks();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", tasks.size());
        response.put("tasks", tasks);
        return ResponseEntity.ok(response);
    }

    /** Self-healing schedule optimization — returns real task changes with audit data */
    @PostMapping("/schedule/optimize-full")
    public ResponseEntity<Map<String, Object>> optimizeFullSchedule() {
        Map<String, Object> result = scheduleService.optimizeFullSchedule();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-learning-plan")
    public ResponseEntity<Map<String, Object>> generateLearningPlan(@RequestBody LearningPlanRequestDto dto) {
        LearningPlanResponseDto plan = scheduleService.generateLearningPlan(dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("plan", plan);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tasks/batch")
    public ResponseEntity<Map<String, Object>> batchScheduleTasks(@RequestBody BatchScheduleRequestDto dto) {
        List<TaskResponseDto> scheduledTasks = scheduleService.batchScheduleTasks(dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("scheduledCount", scheduledTasks.size());
        response.put("tasks", scheduledTasks);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/schedule/task/{id}/complete")
    public ResponseEntity<Map<String, Object>> toggleTaskCompletion(@PathVariable Long id) {
        TaskResponseDto updatedTask = scheduleService.toggleTaskCompletion(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task completion status updated.");
        response.put("task", updatedTask);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/schedule/task/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable Long id) {
        scheduleService.deleteTask(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/schedule/task/{id}/optimize")
    public ResponseEntity<Map<String, Object>> optimizeTaskSlot(@PathVariable Long id) {
        TaskResponseDto task = scheduleService.optimizeTaskSlot(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task optimized to peak focus zone.");
        response.put("task", task);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        AnalyticsResponseDto analytics = scheduleService.getAnalyticsSummary();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("analytics", analytics);
        return ResponseEntity.ok(response);
    }

    /** Engine v2: Audit trail with explainable 'WHY?' rationale for schedule changes */
    @GetMapping("/schedule/audit-trail")
    public ResponseEntity<Map<String, Object>> getScheduleAuditTrail() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("auditTrail", scheduleChangeAuditService.getRecentAuditTrail());
        return ResponseEntity.ok(response);
    }

    /** Engine v2: AI Day Brief & Schedule Health metrics */
    @GetMapping("/schedule/day-brief")
    public ResponseEntity<Map<String, Object>> getDayBrief() {
        Map<String, Object> response = productivityRecommendationService.generateDayBrief();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    /** Engine v2: Planning Fallacy Accuracy & Bias Metrics */
    @GetMapping("/analytics/fallacy")
    public ResponseEntity<Map<String, Object>> getPlanningFallacyMetrics() {
        Map<String, Object> response = planningFallacyEngine.calculateFallacyMetrics();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
