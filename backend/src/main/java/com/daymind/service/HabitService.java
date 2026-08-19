package com.daymind.service;

import com.daymind.exception.InvalidTaskException;
import com.daymind.model.Habit;
import com.daymind.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    @Autowired
    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public List<Habit> getAllHabits() {
        return habitRepository.findByArchivedFalseOrderByCreatedAtDesc();
    }

    public Habit createHabit(Map<String, Object> payload) {
        Habit habit = new Habit();
        habit.setName((String) payload.getOrDefault("name", "New Habit"));
        habit.setDescription((String) payload.getOrDefault("description", ""));
        habit.setIcon((String) payload.getOrDefault("icon", "✅"));
        habit.setColor((String) payload.getOrDefault("color", "#6c5ce7"));

        if (payload.containsKey("frequency")) {
            try {
                habit.setFrequency(Habit.HabitFrequency.valueOf((String) payload.get("frequency")));
            } catch (Exception ignored) {}
        }
        return habitRepository.save(habit);
    }

    /**
     * Toggle completion for a given date (today by default).
     * Recomputes streak after toggle.
     */
    public Habit toggleHabitDate(Long id, String dateStr) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Habit not found with ID: " + id));

        LocalDate date = (dateStr != null && !dateStr.isEmpty())
                ? LocalDate.parse(dateStr)
                : LocalDate.now();

        habit.toggleDate(date);
        habit.recomputeStreak();
        return habitRepository.save(habit);
    }

    public Habit updateHabit(Long id, Map<String, Object> payload) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Habit not found with ID: " + id));

        if (payload.containsKey("name")) habit.setName((String) payload.get("name"));
        if (payload.containsKey("description")) habit.setDescription((String) payload.get("description"));
        if (payload.containsKey("icon")) habit.setIcon((String) payload.get("icon"));
        if (payload.containsKey("color")) habit.setColor((String) payload.get("color"));

        return habitRepository.save(habit);
    }

    public void deleteHabit(Long id) {
        if (!habitRepository.existsById(id)) {
            throw new InvalidTaskException("Habit not found with ID: " + id);
        }
        habitRepository.deleteById(id);
    }

    public Habit archiveHabit(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Habit not found with ID: " + id));
        habit.setArchived(true);
        return habitRepository.save(habit);
    }

    /**
     * Returns the overall max streak across all habits — used for KpiCards "Streak" card.
     */
    public int getMaxCurrentStreak() {
        return habitRepository.findByArchivedFalseOrderByCreatedAtDesc()
                .stream()
                .mapToInt(Habit::getCurrentStreak)
                .max()
                .orElse(0);
    }
}
