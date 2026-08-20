package com.daymind.config;

import com.daymind.factory.TaskFactory;
import com.daymind.model.*;
import com.daymind.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * DataInitializer seeds the in-memory H2 database with realistic demo data
 * on every application startup. Ensures the app is populated immediately.
 *
 * Implements CommandLineRunner — Spring Boot lifecycle pattern.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final NoteRepository noteRepository;
    private final GoalRepository goalRepository;
    private final FocusSessionRepository focusSessionRepository;
    private final MeetingRepository meetingRepository;

    @Autowired
    public DataInitializer(
            TaskRepository taskRepository,
            HabitRepository habitRepository,
            NoteRepository noteRepository,
            GoalRepository goalRepository,
            FocusSessionRepository focusSessionRepository,
            MeetingRepository meetingRepository) {
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
        this.noteRepository = noteRepository;
        this.goalRepository = goalRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.meetingRepository = meetingRepository;
    }

    @Override
    public void run(String... args) {
        log.info("[DAYMIND] DataInitializer starting — seeding demo data...");
        seedTasks();
        seedHabits();
        seedNotes();
        seedGoals();
        seedFocusSessions();
        seedMeetings();
        log.info("[DAYMIND] ✅ All demo data seeded. Application ready.");
    }

    private void seedTasks() {
        taskRepository.deleteAll();
        LocalDate today = LocalDate.now();
        String todayName = getDayName(today);
        String tomorrowName = getDayName(today.plusDays(1));

        // Task 1: Deep work
        BaseTask t1 = TaskFactory.createTask("Deep Work: System Design Review",
                "deep work system design review", 90, 8, todayName, Category.WORK, Priority.HIGH);
        t1.setScheduledDate(today);
        t1.setCompleted(false);
        taskRepository.save(t1);

        // Task 2: Cybersecurity report
        BaseTask t2 = TaskFactory.createTask("Cybersecurity Project Report",
                "finish cybersecurity assignment report", 75, 10, todayName, Category.ACADEMIC, Priority.HIGH);
        t2.setScheduledDate(today);
        t2.setDueDate(today.plusDays(1));
        t2.setCompleted(false);
        taskRepository.save(t2);

        // Task 3: Team standup
        BaseTask t3 = TaskFactory.createTask("Team Standup & Sprint Planning",
                "team standup sprint planning meeting", 30, 11, todayName, Category.WORK, Priority.MEDIUM);
        t3.setScheduledDate(today);
        t3.setCompleted(false);
        taskRepository.save(t3);

        // Task 4: Java OOP Study
        BaseTask t4 = TaskFactory.createTask("Java OOP — Design Patterns Study",
                "java oop design patterns study", 60, 14, todayName, Category.ACADEMIC, Priority.HIGH);
        t4.setScheduledDate(today);
        t4.setCompleted(false);
        taskRepository.save(t4);

        // Task 5: Workout
        BaseTask t5 = TaskFactory.createTask("Evening Workout & Running",
                "workout gym run health", 45, 17, todayName, Category.HEALTH, Priority.MEDIUM);
        t5.setScheduledDate(today);
        t5.setCompleted(false);
        taskRepository.save(t5);

        // Task 6: ML Course
        BaseTask t6 = TaskFactory.createTask("Machine Learning: Neural Networks Module",
                "ml course neural networks learn deep learning", 90, 19, todayName, Category.LEARNING, Priority.MEDIUM);
        t6.setScheduledDate(today);
        t6.setCompleted(false);
        taskRepository.save(t6);

        // Task 7: URGENT bug fix today
        BaseTask t7 = TaskFactory.createTask("URGENT: Fix Production API Bug",
                "urgent fix bug crash production api", 45, 15, todayName, Category.URGENT, Priority.URGENT);
        t7.setScheduledDate(today);
        t7.setDueDate(today);
        t7.setCompleted(false);
        taskRepository.save(t7);

        // Task 8: Tomorrow — React project
        BaseTask t8 = TaskFactory.createTask("DayMind Frontend — Calendar Integration",
                "react frontend calendar integration daymind", 120, 9, tomorrowName, Category.WORK, Priority.HIGH);
        t8.setScheduledDate(today.plusDays(1));
        t8.setDueDate(today.plusDays(2));
        t8.setCompleted(false);
        taskRepository.save(t8);

        // Task 9: Tomorrow — DB work
        BaseTask t9 = TaskFactory.createTask("Spring Boot JPA Schema Optimization",
                "spring boot database jpa optimization", 60, 11, tomorrowName, Category.WORK, Priority.MEDIUM);
        t9.setScheduledDate(today.plusDays(1));
        t9.setCompleted(false);
        taskRepository.save(t9);

        // Task 10: Yesterday — reading
        BaseTask t10 = TaskFactory.createTask("Read: Atomic Habits — Chapter 8",
                "read book personal atomic habits", 30, 20, getDayName(today.minusDays(1)), Category.PERSONAL, Priority.LOW);
        t10.setScheduledDate(today.minusDays(1));
        t10.setCompleted(false);
        taskRepository.save(t10);

        log.info("[DAYMIND] Seeded {} tasks.", taskRepository.count());
    }

    private void seedHabits() {
        if (habitRepository.count() > 0) return;

        String[] names   = {"Deep Work",  "Exercise",  "Reading",   "Coding",    "Meditation"};
        String[] icons   = {"🎯",          "🏃",         "📚",         "💻",         "🧘"};
        int[]    streaks = {12,            7,           21,          15,          4};
        String[] colors  = {"#6366f1",    "#10b981",   "#f59e0b",   "#3b82f6",   "#8b5cf6"};

        for (int i = 0; i < names.length; i++) {
            Habit h = new Habit();
            h.setName(names[i]);
            h.setIcon(icons[i]);
            h.setColor(colors[i]);
            h.setCurrentStreak(streaks[i]);
            h.setLongestStreak(streaks[i] + 3);
            // Mark past N days as completed to match streak
            LocalDate d = LocalDate.now();
            for (int j = 0; j < streaks[i] && j < 14; j++) {
                h.getCompletedDates().add(d.minusDays(j).toString());
            }
            habitRepository.save(h);
        }
        log.info("[DAYMIND] Seeded {} habits.", habitRepository.count());
    }

    private void seedNotes() {
        if (noteRepository.count() > 0) return;

        createNote("DayMind Architecture Ideas",
                "The scheduling engine needs to be smarter. Ideas:\n\n1. Add energy level tracking\n2. Connect meetings → action items → tasks automatically\n3. Build a prediction model for task duration based on historical data\n4. Add natural language scheduling via command bar\n\nNext steps: wire OptimizeDayModal to real task names.",
                "#6366f1", true);

        createNote("Cybersecurity Study Notes",
                "Key topics for the project report:\n\n- Network security fundamentals\n- OWASP Top 10 vulnerabilities\n- SQL injection, XSS, CSRF\n- Authentication patterns (JWT, OAuth)\n- Encryption: AES, RSA, SHA\n\nRemember: deadline is tomorrow! Need to finish methodology section first.",
                "#f59e0b", false);

        createNote("Meeting Follow-up — Sprint Planning",
                "Action items from today's standup:\n\n✓ Ravi: Complete API documentation by Friday\n✓ Kishore: Backend testing by Thursday\n✓ Me: Frontend integration by tomorrow\n\nDecisions made:\n- Adopted new UI design system\n- 90-minute focus blocks for deep work\n- Daily standups at 11 AM",
                "#10b981", false);

        createNote("Learning Goals 2026",
                "Skills to master:\n\n1. Machine Learning (Neural Networks) — ongoing\n2. System Design — reading 'Designing Data-Intensive Applications'\n3. Cybersecurity — CTF practice\n4. DSA — 2 LeetCode problems/day\n5. Spring Boot Advanced — microservices\n\nTarget: Job-ready by December 2026",
                "#3b82f6", false);

        log.info("[DAYMIND] Seeded {} notes.", noteRepository.count());
    }

    private void createNote(String title, String content, String color, boolean pinned) {
        Note n = new Note();
        n.setTitle(title);
        n.setContent(content);
        n.setColor(color);
        n.setPinned(pinned);
        noteRepository.save(n);
    }

    private void seedGoals() {
        if (goalRepository.count() > 0) return;

        Goal g1 = new Goal();
        g1.setTitle("Cybersecurity Job Ready");
        g1.setDescription("Complete all fundamentals and build a portfolio for cybersecurity roles");
        g1.setTargetValue(100);
        g1.setCurrentValue(42);
        g1.setUnit("% complete");
        g1.setDeadline(LocalDate.now().plusDays(120));
        g1.setCategory("ACADEMIC");
        g1.setIcon("🔐");
        goalRepository.save(g1);

        Goal g2 = new Goal();
        g2.setTitle("Machine Learning Mastery");
        g2.setDescription("Complete ML specialization and build 3 end-to-end projects");
        g2.setTargetValue(10);
        g2.setCurrentValue(4);
        g2.setUnit("modules");
        g2.setDeadline(LocalDate.now().plusDays(90));
        g2.setCategory("LEARNING");
        g2.setIcon("🤖");
        goalRepository.save(g2);

        Goal g3 = new Goal();
        g3.setTitle("DayMind AI Launch");
        g3.setDescription("Ship the full DayMind AI product with all core features");
        g3.setTargetValue(8);
        g3.setCurrentValue(5);
        g3.setUnit("features");
        g3.setDeadline(LocalDate.now().plusDays(30));
        g3.setCategory("WORK");
        g3.setIcon("🚀");
        goalRepository.save(g3);

        log.info("[DAYMIND] Seeded {} goals.", goalRepository.count());
    }

    private void seedFocusSessions() {
        if (focusSessionRepository.count() > 0) return;

        LocalDate today = LocalDate.now();
        int[]    minutesPerDay = {90, 120, 75, 150, 60, 180, 45};
        String[] taskTitles    = {"System Design Review", "Cybersecurity Report",
                "API Development", "Java OOP Study", "ML Neural Networks",
                "DayMind Frontend", "Data Structures"};
        String[] categories    = {"WORK","ACADEMIC","WORK","ACADEMIC","LEARNING","WORK","ACADEMIC"};

        for (int i = 0; i < 7; i++) {
            FocusSession fs = new FocusSession();
            fs.setTaskTitle(taskTitles[i]);
            fs.setTaskCategory(categories[i]);
            fs.setPlannedMinutes(minutesPerDay[i]);
            fs.setActualMinutes(minutesPerDay[i]);
            fs.setSessionDate(today.minusDays(6 - i));
            fs.setCompleted(true);
            fs.setEndTime(LocalDateTime.now().minusDays(6 - i).withHour(12));
            focusSessionRepository.save(fs);
        }
        log.info("[DAYMIND] Seeded {} focus sessions.", focusSessionRepository.count());
    }

    private void seedMeetings() {
        if (meetingRepository.count() > 0) return;

        Meeting m1 = new Meeting();
        m1.setTitle("DayMind Sprint Planning");
        m1.setTranscript("We discussed the Q3 roadmap for DayMind AI. Ravi will prepare the API documentation by Friday. Kishore will complete backend testing by Thursday. I will finish the frontend calendar integration by tomorrow. We decided to adopt the new glassmorphic UI design system and approved 90-minute focus blocks for deep work sessions. Daily standups will happen at 11 AM going forward.");
        m1.setSummary("Q3 roadmap planning. Tasks assigned to team. UI design system adopted.");
        m1.setKeyPoints(new ArrayList<>(List.of("Finalized 3 new feature concepts", "User research to be completed by Friday", "Adopted glassmorphic UI system")));
        m1.setDecisions(new ArrayList<>(List.of("Approved 90-minute focus blocks", "Daily standups at 11 AM")));
        m1.setParticipants(new ArrayList<>(List.of("Nithish B", "Ravi K", "Kishore M")));
        m1.setStartTime("11:00 AM");
        m1.setEndTime("11:45 AM");
        m1.setStatus(Meeting.MeetingStatus.COMPLETED);
        m1.setAnalyzed(true);
        meetingRepository.save(m1);

        Meeting m2 = new Meeting();
        m2.setTitle("Cybersecurity Project Review");
        m2.setTranscript("The cybersecurity project report needs to be completed by tomorrow. We reviewed the current progress on the methodology section. The team agreed that web security vulnerabilities and authentication patterns should be the main focus. Action items: complete the threat modeling section, add OWASP references, and prepare the conclusion by end of day.");
        m2.setSummary("Project review for cybersecurity report submission. Methodology and threat modeling are priority.");
        m2.setKeyPoints(new ArrayList<>(List.of("Review threat modeling", "OWASP top 10 reference integration")));
        m2.setDecisions(new ArrayList<>(List.of("Focus report on Web Vulnerabilities and Auth")));
        m2.setParticipants(new ArrayList<>(List.of("Nithish B", "Sarah M")));
        m2.setStartTime("02:00 PM");
        m2.setEndTime("02:30 PM");
        m2.setStatus(Meeting.MeetingStatus.UPCOMING);
        m2.setMeetingDate(LocalDate.now().plusDays(1));
        meetingRepository.save(m2);

        log.info("[DAYMIND] Seeded {} meetings.", meetingRepository.count());
    }

    /** Helper: get proper day name for a date */
    private String getDayName(LocalDate date) {
        String raw = date.getDayOfWeek().name();
        return raw.charAt(0) + raw.substring(1).toLowerCase();
    }
}
