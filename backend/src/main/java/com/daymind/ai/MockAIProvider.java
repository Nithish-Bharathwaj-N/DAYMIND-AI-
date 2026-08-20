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
        String safeTitle = (title != null && !title.isBlank()) ? title : "Meeting Call";
        response.put("meetingTitle", safeTitle);

        if (transcript == null || transcript.isBlank()) {
            response.put("summary", "Brief sync call regarding " + safeTitle + ".");
            response.put("keyPoints", new ArrayList<>(List.of("Discussion completed", "No transcript text provided")));
            response.put("decisions", new ArrayList<>(List.of("Follow up scheduled for tomorrow")));
            response.put("actionItems", new ArrayList<>());
            return response;
        }

        String[] lines = transcript.split("\n");
        List<String> keyPoints = new ArrayList<>();
        List<String> decisions = new ArrayList<>();
        List<Map<String, Object>> actionItems = new ArrayList<>();
        int itemId = 1;

        String currentSpeaker = "You";
        StringBuilder summaryBuilder = new StringBuilder();
        summaryBuilder.append("Meeting focused on ").append(safeTitle).append(". ");

        int slotHour = 9;

        for (String rawLine : lines) {
            String line = rawLine.trim();
            if (line.isBlank()) continue;

            // Detect speaker format: "Name: sentence" or "Name - sentence"
            String textContent = line;
            if (line.contains(":")) {
                String[] parts = line.split(":", 2);
                currentSpeaker = parts[0].trim();
                textContent = parts[1].trim();
            } else if (line.contains(" - ")) {
                String[] parts = line.split(" - ", 2);
                currentSpeaker = parts[0].trim();
                textContent = parts[1].trim();
            }

            String lower = textContent.toLowerCase();

            // Detect decisions
            if (lower.contains("decided") || lower.contains("agreed") || lower.contains("approve") || lower.contains("adopt") || lower.contains("finalize")) {
                decisions.add(textContent.substring(0, Math.min(textContent.length(), 120)));
            }

            // Detect key discussion points
            if (lower.contains("need") || lower.contains("discuss") || lower.contains("roadmap") || lower.contains("plan") || lower.contains("important")) {
                keyPoints.add(textContent.substring(0, Math.min(textContent.length(), 120)));
            }

            // Detect action items: look for task indicators
            boolean isActionItem = lower.contains("i will") || lower.contains("i can") || lower.contains("need to") ||
                    lower.contains("let's") || lower.contains("take on") || lower.contains("finish") ||
                    lower.contains("prepare") || lower.contains("study") || lower.contains("fix") ||
                    lower.contains("report") || lower.contains("research") || lower.contains("create") ||
                    lower.contains("build") || lower.contains("write") || lower.contains("submit");

            if (isActionItem) {
                // Clean task title
                String taskTitle = textContent
                        .replaceAll("(?i)^(let's|i will|i can|we need to|need to|please|i'll)\\s+", "")
                        .trim();
                if (taskTitle.length() > 60) {
                    taskTitle = taskTitle.substring(0, 60) + "...";
                }
                if (taskTitle.length() < 5) {
                    taskTitle = "Action item: " + safeTitle;
                }
                taskTitle = Character.toUpperCase(taskTitle.charAt(0)) + taskTitle.substring(1);

                // Category detection
                String category = "WORK";
                if (lower.contains("cybersecurity") || lower.contains("java") || lower.contains("assignment") || lower.contains("study") || lower.contains("report") || lower.contains("exam")) {
                    category = "ACADEMIC";
                } else if (lower.contains("fix") || lower.contains("bug") || lower.contains("urgent") || lower.contains("crash")) {
                    category = "URGENT";
                } else if (lower.contains("learn") || lower.contains("course") || lower.contains("ml") || lower.contains("read")) {
                    category = "LEARNING";
                } else if (lower.contains("workout") || lower.contains("health") || lower.contains("gym")) {
                    category = "HEALTH";
                }

                // Priority detection
                String priority = "MEDIUM";
                if (lower.contains("urgent") || lower.contains("asap") || lower.contains("critical") || lower.contains("today")) {
                    priority = "URGENT";
                } else if (lower.contains("important") || lower.contains("high") || lower.contains("must")) {
                    priority = "HIGH";
                }

                // Duration detection
                int duration = 60;
                if (lower.contains("30") || lower.contains("half hour")) duration = 30;
                if (lower.contains("45")) duration = 45;
                if (lower.contains("90")) duration = 90;
                if (lower.contains("2 hour") || lower.contains("120")) duration = 120;

                String slotTime = String.format("%02d:00 %s", (slotHour > 12 ? slotHour - 12 : slotHour), (slotHour >= 12 ? "PM" : "AM"));
                slotHour = (slotHour + 2 > 17) ? 9 : slotHour + 2;

                Map<String, Object> item = new HashMap<>();
                item.put("id", itemId++);
                item.put("task", taskTitle);
                item.put("owner", currentSpeaker);
                item.put("dueDate", lower.contains("today") ? "Today" : lower.contains("tomorrow") ? "Tomorrow" : "This Week");
                item.put("estimatedMinutes", duration);
                item.put("suggestedSlot", "Today @ " + slotTime);
                item.put("reason", "NLP Engine placed this in optimal " + category.toLowerCase() + " focus slot.");
                item.put("priority", priority);
                item.put("category", category);

                actionItems.add(item);
            }
        }

        // Fallbacks if lists empty
        if (keyPoints.isEmpty()) {
            keyPoints.add("Key objectives and tasks reviewed for " + safeTitle);
            keyPoints.add("Timeline and deadlines aligned across team");
        }
        if (decisions.isEmpty()) {
            decisions.add("Approved post-meeting execution schedule");
        }
        if (actionItems.isEmpty()) {
            Map<String, Object> fallbackItem = new HashMap<>();
            fallbackItem.put("id", 1);
            fallbackItem.put("task", "Follow up on " + safeTitle + " action items");
            fallbackItem.put("owner", "You");
            fallbackItem.put("dueDate", "Today");
            fallbackItem.put("estimatedMinutes", 45);
            fallbackItem.put("suggestedSlot", "Today @ 02:00 PM");
            fallbackItem.put("reason", "Action item generated from meeting notes.");
            fallbackItem.put("priority", "HIGH");
            fallbackItem.put("category", "WORK");
            actionItems.add(fallbackItem);
        }

        summaryBuilder.append(String.format("Identified %d key action items and %d major decisions.", actionItems.size(), decisions.size()));

        response.put("summary", summaryBuilder.toString());
        response.put("keyPoints", keyPoints);
        response.put("decisions", decisions);
        response.put("actionItems", actionItems);

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
