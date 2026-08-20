package com.daymind.service;

import com.daymind.ai.AIProvider;
import com.daymind.exception.InvalidTaskException;
import com.daymind.factory.TaskFactory;
import com.daymind.model.*;
import com.daymind.repository.MeetingRepository;
import com.daymind.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final TaskRepository taskRepository;
    private final AIProvider aiProvider;

    @Autowired
    public MeetingService(MeetingRepository meetingRepository, TaskRepository taskRepository, AIProvider aiProvider) {
        this.meetingRepository = meetingRepository;
        this.taskRepository = taskRepository;
        this.aiProvider = aiProvider;
    }

    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAllByOrderByMeetingDateDescCreatedAtDesc();
    }

    public Meeting createMeeting(Map<String, Object> payload) {
        Meeting meeting = new Meeting();
        meeting.setTitle((String) payload.getOrDefault("title", "Untitled Meeting"));
        meeting.setPlatform((String) payload.getOrDefault("platform", "Google Meet"));

        if (payload.containsKey("participants")) {
            meeting.setParticipants((List<String>) payload.get("participants"));
        }
        if (payload.containsKey("startTime")) {
            meeting.setStartTime((String) payload.get("startTime"));
        }
        if (payload.containsKey("endTime")) {
            meeting.setEndTime((String) payload.get("endTime"));
        }
        if (payload.containsKey("meetingDate")) {
            try {
                meeting.setMeetingDate(LocalDate.parse((String) payload.get("meetingDate")));
            } catch (Exception e) {
                meeting.setMeetingDate(LocalDate.now());
            }
        }

        String statusStr = (String) payload.getOrDefault("status", "UPCOMING");
        try {
            meeting.setStatus(Meeting.MeetingStatus.valueOf(statusStr));
        } catch (Exception e) {
            meeting.setStatus(Meeting.MeetingStatus.UPCOMING);
        }

        return meetingRepository.save(meeting);
    }

    public Map<String, Object> analyzeTranscript(Long meetingId, String transcript) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new InvalidTaskException("Meeting not found with ID: " + meetingId));

        meeting.setTranscript(transcript);

        // Use AI Provider (MockAIProvider or real) to analyze
        Map<String, Object> analysis = aiProvider.summarizeMeeting(meeting.getTitle(), transcript);

        // Persist analyzed results back to DB safely with mutable lists
        meeting.setSummary((String) analysis.getOrDefault("summary", ""));
        meeting.setAnalyzed(true);
        meeting.setStatus(Meeting.MeetingStatus.COMPLETED);

        if (analysis.containsKey("keyPoints") && analysis.get("keyPoints") instanceof List<?>) {
            meeting.setKeyPoints(new ArrayList<>((List<String>) analysis.get("keyPoints")));
        }
        if (analysis.containsKey("decisions") && analysis.get("decisions") instanceof List<?>) {
            meeting.setDecisions(new ArrayList<>((List<String>) analysis.get("decisions")));
        }

        meetingRepository.save(meeting);
        analysis.put("meetingId", meetingId);
        return analysis;
    }

    public Map<String, Object> convertActionItemsToTasks(Long meetingId, List<Map<String, Object>> actionItems) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new InvalidTaskException("Meeting not found with ID: " + meetingId));

        int scheduled = 0;
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
        int slotStart = 9;

        for (Map<String, Object> item : actionItems) {
            String taskTitle = (String) item.getOrDefault("task", "Action Item from " + meeting.getTitle());
            int duration = 60;
            if (item.containsKey("estimatedMinutes") && item.get("estimatedMinutes") != null) {
                duration = ((Number) item.get("estimatedMinutes")).intValue();
            }

            // Find an available slot
            int slot = slotStart + scheduled;
            if (slot > 17) slot = 9 + (scheduled % 9);

            BaseTask task = TaskFactory.createTask(
                    taskTitle,
                    "Action item from meeting: " + meeting.getTitle(),
                    duration,
                    slot,
                    days[scheduled % days.length],
                    Category.WORK,
                    Priority.HIGH
            );
            task.setScheduled(true);
            taskRepository.save(task);
            scheduled++;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("meetingTitle", meeting.getTitle());
        result.put("scheduledTasksCount", scheduled);
        result.put("message", String.format("✅ %d action items from '%s' converted into scheduled tasks.", scheduled, meeting.getTitle()));
        return result;
    }

    public void deleteMeeting(Long id) {
        if (!meetingRepository.existsById(id)) {
            throw new InvalidTaskException("Meeting not found with ID: " + id);
        }
        meetingRepository.deleteById(id);
    }
}
