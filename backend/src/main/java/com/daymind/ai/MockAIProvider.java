package com.daymind.ai;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MockAIProvider implements AIProvider {

    @Override
    public Map<String, Object> classifyAndParseTask(String rawPrompt) {
        String lower = rawPrompt.toLowerCase();
        Map<String, Object> result = new HashMap<>();

        String category = "WORK";
        int duration = 60;
        String priority = "MEDIUM";
        String dayOfWeek = "Monday";
        int hourSlot = 10;

        if (lower.contains("academic") || lower.contains("study") || lower.contains("exam") || lower.contains("assignment") || lower.contains("dsa") || lower.contains("java")) {
            category = "ACADEMIC";
            duration = 75;
        } else if (lower.contains("health") || lower.contains("gym") || lower.contains("workout") || lower.contains("run")) {
            category = "HEALTH";
            duration = 45;
        } else if (lower.contains("urgent") || lower.contains("crash") || lower.contains("fix") || lower.contains("bug")) {
            category = "URGENT";
            duration = 60;
            priority = "URGENT";
        } else if (lower.contains("personal") || lower.contains("read") || lower.contains("buy")) {
            category = "PERSONAL";
            duration = 45;
        } else if (lower.contains("ml") || lower.contains("course") || lower.contains("learn")) {
            category = "LEARNING";
            duration = 90;
        }

        // Duration extraction
        if (lower.contains("2 hours") || lower.contains("2h")) duration = 120;
        if (lower.contains("30 mins") || lower.contains("30m")) duration = 30;
        if (lower.contains("90 mins") || lower.contains("90m")) duration = 90;

        // Day extraction
        for (String d : List.of("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")) {
            if (lower.contains(d)) {
                dayOfWeek = d.substring(0, 1).toUpperCase() + d.substring(1);
                break;
            }
        }
        if (lower.contains("tomorrow")) dayOfWeek = "Tuesday";

        result.put("title", rawPrompt);
        result.put("category", category);
        result.put("userEstimatedMinutes", duration);
        result.put("priority", priority);
        result.put("dayOfWeek", dayOfWeek);
        result.put("assignedHourSlot", hourSlot);
        result.put("confidence", 0.95);
        result.put("reasoning", "Parsed duration and priority based on prompt keywords.");

        return result;
    }

    @Override
    public Map<String, Object> summarizeMeeting(String title, String transcript) {
        Map<String, Object> response = new HashMap<>();

        response.put("meetingTitle", title != null ? title : "Brainstorming Call");
        response.put("summary", "Discussed Q2 roadmap, new feature ideas, and assigned tasks to team members.");
        
        List<String> keyPoints = List.of(
            "Finalized 3 new feature concepts",
            "User research to be completed by Friday",
            "Next review meeting scheduled for May 16"
        );
        response.put("keyPoints", keyPoints);

        List<Map<String, Object>> actionItems = new ArrayList<>();
        
        Map<String, Object> item1 = new HashMap<>();
        item1.put("id", 1);
        item1.put("task", "Prepare user flow drafts");
        item1.put("owner", "Nithish B");
        item1.put("dueDate", "May 14");
        item1.put("estimatedMinutes", 90);
        item1.put("suggestedSlot", "Tomorrow @ 10:00 AM");
        item1.put("reason", "Your calendar is free and historical focus performance is high during morning hours.");
        item1.put("priority", "HIGH");
        item1.put("category", "WORK");

        Map<String, Object> item2 = new HashMap<>();
        item2.put("id", 2);
        item2.put("task", "Market research & competitor matrix");
        item2.put("owner", "Sarah M");
        item2.put("dueDate", "May 15");
        item2.put("estimatedMinutes", 60);
        item2.put("suggestedSlot", "Wednesday @ 02:00 PM");
        item2.put("reason", "Optimal afternoon execution window.");
        item2.put("priority", "MEDIUM");
        item2.put("category", "WORK");

        actionItems.add(item1);
        actionItems.add(item2);

        response.put("actionItems", actionItems);
        response.put("decisions", List.of("Adopted new glassmorphic UI design system", "Approved 90-minute focus blocks for deep work"));

        return response;
    }

    @Override
    public Map<String, Object> optimizeDaySchedule(List<Map<String, Object>> currentTasks) {
        Map<String, Object> result = new HashMap<>();

        List<Map<String, Object>> changes = new ArrayList<>();

        Map<String, Object> change1 = new HashMap<>();
        change1.put("taskTitle", "Data Structures Study");
        change1.put("fromSlot", "02:00 PM");
        change1.put("toSlot", "09:00 AM");
        change1.put("reason", "Your historical completion rate is 23% higher during morning focus hours (8 AM - 11 AM).");

        Map<String, Object> change2 = new HashMap<>();
        change2.put("taskTitle", "Reading & Reflection");
        change2.put("fromSlot", "05:15 PM");
        change2.put("toSlot", "07:00 PM");
        change2.put("reason", "Moved lower-priority personal task to evening to protect peak afternoon deep work.");

        changes.add(change1);
        changes.add(change2);

        result.put("status", "OPTIMIZED");
        result.put("changesCount", changes.size());
        result.put("changes", changes);
        result.put("explanation", "Rescheduled 2 tasks based on your historical focus heatmaps and energy curves.");

        return result;
    }

    @Override
    public String generateAssistantResponse(String userQuery, Map<String, Object> appContext) {
        String lower = userQuery.toLowerCase();
        if (lower.contains("focus") || lower.contains("now") || lower.contains("work on") || lower.contains("should i")) {
            return "🎯 **Recommended Focus Right Now**: Based on your schedule and peak focus window, you should tackle **'Deep Work & High Priority Tasks'**.\n\nYour current focus capacity is high (8–11 AM block). Focus for 50 minutes using the **Deep Focus Mode HUD**!";
        } else if (lower.contains("optimize") || lower.contains("schedule") || lower.contains("plan")) {
            return "✨ **Schedule Optimization Ready**: I have analyzed your 10 scheduled tasks. Click the **'Run Self-Healing Optimizer'** button to shift lower-priority items into afternoon slots and protect your morning focus!";
        } else if (lower.contains("peak") || lower.contains("productivity") || lower.contains("hours")) {
            return "⚡ **Peak Energy Heatmap**: Your historical completion rate is **23% higher between 9:00 AM – 11:30 AM**. Secondary peak occurs at **2:00 PM – 4:00 PM**.";
        } else if (lower.contains("meeting") || lower.contains("calls") || lower.contains("transcript")) {
            return "📅 **Meeting Intelligence**: You have upcoming syncs today. Upload or record transcripts in the **Meetings** view to automatically extract action items into your task queue!";
        } else if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey")) {
            return "👋 **Hello! I'm DayMind AI**, your personal productivity operating system. Ask me what to focus on, how to optimize your day, or try typing a task in the ⌘K command bar!";
        }
        return "⚡ **DayMind Assistant**: I can help you prioritize tasks, run self-healing schedule optimization, track habits, and convert meeting notes into action items. Ask me: *'What should I focus on right now?'* or *'Optimize my schedule for today.'*";
    }
}
