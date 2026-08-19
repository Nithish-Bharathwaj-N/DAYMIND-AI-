package com.daymind.intelligence;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ScheduleChangeAuditService — Intelligence Engine v2
 * Records automatic replanning changes and provides explainable rationale
 * ("WHY WAS THIS MOVED?" / "WHY THIS TIME?").
 */
@Service
public class ScheduleChangeAuditService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleChangeAuditService.class);

    private final List<AuditEntry> auditTrail = Collections.synchronizedList(new ArrayList<>());

    public AuditEntry recordChange(Long taskId, String taskTitle, int fromSlot, int toSlot, String trigger, String reason, String whyExplanation) {
        AuditEntry entry = new AuditEntry(
                UUID.randomUUID().toString(),
                taskId,
                taskTitle,
                formatHour(fromSlot),
                formatHour(toSlot),
                trigger,
                reason,
                whyExplanation,
                LocalDateTime.now().toString()
        );
        auditTrail.add(0, entry); // latest first
        log.info("[AUDIT] Task '{}' moved {} -> {}. Trigger: {}. Reason: {}", taskTitle, entry.getFromSlot(), entry.getToSlot(), trigger, reason);
        return entry;
    }

    public List<AuditEntry> getRecentAuditTrail() {
        return new ArrayList<>(auditTrail);
    }

    private String formatHour(int hour) {
        if (hour == 0) return "Unscheduled";
        String suffix = hour >= 12 ? "PM" : "AM";
        int displayH = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour;
        return String.format("%02d:00 %s", displayH, suffix);
    }

    public static class AuditEntry {
        private final String id;
        private final Long taskId;
        private final String taskTitle;
        private final String fromSlot;
        private final String toSlot;
        private final String trigger;
        private final String reason;
        private final String whyExplanation;
        private final String timestamp;

        public AuditEntry(String id, Long taskId, String taskTitle, String fromSlot, String toSlot, String trigger, String reason, String whyExplanation, String timestamp) {
            this.id = id;
            this.taskId = taskId;
            this.taskTitle = taskTitle;
            this.fromSlot = fromSlot;
            this.toSlot = toSlot;
            this.trigger = trigger;
            this.reason = reason;
            this.whyExplanation = whyExplanation;
            this.timestamp = timestamp;
        }

        public String getId() { return id; }
        public Long getTaskId() { return taskId; }
        public String getTaskTitle() { return taskTitle; }
        public String getFromSlot() { return fromSlot; }
        public String getToSlot() { return toSlot; }
        public String getTrigger() { return trigger; }
        public String getReason() { return reason; }
        public String getWhyExplanation() { return whyExplanation; }
        public String getTimestamp() { return timestamp; }
    }
}
