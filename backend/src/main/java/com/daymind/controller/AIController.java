package com.daymind.controller;

import com.daymind.ai.AIProvider;
import com.daymind.model.BaseTask;
import com.daymind.repository.TaskRepository;
import com.daymind.service.FocusSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIProvider aiProvider;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private FocusSessionService focusSessionService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithAssistant(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        if (query == null || query.isBlank()) {
            query = payload.getOrDefault("message", "");
        }
        List<BaseTask> tasks = taskRepository.findAll();
        Map<String, Object> context = new HashMap<>();
        context.put("tasks", tasks);

        String reply = aiProvider.generateAssistantResponse(query, context);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("reply", reply);
        response.put("timestamp", new Date());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/task-parse")
    public ResponseEntity<Map<String, Object>> parseTaskPrompt(@RequestBody Map<String, String> payload) {
        String prompt = payload.getOrDefault("prompt", "");
        Map<String, Object> parsed = aiProvider.classifyAndParseTask(prompt);
        parsed.put("success", true);
        return ResponseEntity.ok(parsed);
    }

    /**
     * Fixed: now reads REAL tasks from DB and generates REAL optimization suggestions.
     */
    @PostMapping("/optimize-schedule")
    public ResponseEntity<Map<String, Object>> optimizeSchedule() {
        List<BaseTask> allTasks = taskRepository.findAll();

        // Convert entity list to the Map format the AIProvider interface expects
        List<Map<String, Object>> taskMaps = allTasks.stream().map(t -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id",       t.getId());
            m.put("title",    t.getTitle());
            m.put("category", t.getCategory() != null ? t.getCategory().name() : "OTHER");
            m.put("priority", t.getPriority() != null ? t.getPriority().name() : "MEDIUM");
            m.put("estimatedMinutes", t.getUserEstimatedMinutes());
            m.put("completed", t.isCompleted());
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> result = aiProvider.optimizeDaySchedule(taskMaps);
        result.put("success", true);
        result.put("taskCount", allTasks.size());
        return ResponseEntity.ok(result);
    }

    /**
     * Returns AI suggestions based on actual pending tasks.
     */
    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions() {
        List<BaseTask> allTasks = taskRepository.findAll();
        List<BaseTask> pending = allTasks.stream().filter(t -> !t.isCompleted()).collect(Collectors.toList());
        int todayFocusMins = focusSessionService.getTodayFocusMinutes();

        List<Map<String, String>> suggestions = new ArrayList<>();

        // Suggestion 1: Urgent pending tasks
        long urgentCount = pending.stream()
                .filter(t -> t.getPriority() != null && t.getPriority().name().equals("URGENT"))
                .count();
        if (urgentCount > 0) {
            Map<String, String> s = new HashMap<>();
            s.put("type", "WARNING");
            s.put("icon", "🚨");
            s.put("title", urgentCount + " urgent task" + (urgentCount > 1 ? "s" : "") + " need attention");
            s.put("detail", "Reschedule to peak focus window (9–11 AM).");
            s.put("action", "optimize");
            suggestions.add(s);
        }

        // Suggestion 2: Focus time nudge
        if (todayFocusMins < 120) {
            Map<String, String> s = new HashMap<>();
            s.put("type", "TIP");
            s.put("icon", "🎯");
            s.put("title", "Focus time: " + todayFocusMins + " mins today");
            s.put("detail", "You're below your 6h goal. Start a focus session now.");
            s.put("action", "focus");
            suggestions.add(s);
        }

        // Suggestion 3: Pending count
        if (pending.size() > 5) {
            Map<String, String> s = new HashMap<>();
            s.put("type", "INFO");
            s.put("icon", "📋");
            s.put("title", pending.size() + " tasks pending");
            s.put("detail", "Consider using the Kanban board to prioritize.");
            s.put("action", "tasks");
            suggestions.add(s);
        }

        // Suggestion 4: Productivity encouragement if doing well
        if (allTasks.size() > 0) {
            long completed = allTasks.stream().filter(BaseTask::isCompleted).count();
            int pct = (int) (completed * 100 / allTasks.size());
            if (pct >= 50) {
                Map<String, String> s = new HashMap<>();
                s.put("type", "SUCCESS");
                s.put("icon", "✨");
                s.put("title", pct + "% completion rate — great work!");
                s.put("detail", "You're outperforming your planning bias estimate.");
                s.put("action", "insights");
                suggestions.add(s);
            }
        }

        // Default if nothing
        if (suggestions.isEmpty()) {
            Map<String, String> s = new HashMap<>();
            s.put("type", "TIP");
            s.put("icon", "🌟");
            s.put("title", "You're all caught up!");
            s.put("detail", "Add tasks via ⌘K or the Task form to start scheduling.");
            s.put("action", "tasks");
            suggestions.add(s);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("suggestions", suggestions);
        return ResponseEntity.ok(response);
    }
}
