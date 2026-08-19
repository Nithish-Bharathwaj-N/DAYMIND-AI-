package com.daymind.service;

import com.daymind.exception.InvalidTaskException;
import com.daymind.model.Note;
import com.daymind.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByPinnedDescUpdatedAtDesc();
    }

    public Note createNote(Map<String, Object> payload) {
        Note note = new Note();
        note.setTitle((String) payload.getOrDefault("title", "Untitled Note"));
        note.setContent((String) payload.getOrDefault("content", ""));
        note.setColor((String) payload.getOrDefault("color", "#ffffff"));

        if (payload.containsKey("tags")) {
            note.setTags((List<String>) payload.get("tags"));
        }
        if (payload.containsKey("pinned")) {
            note.setPinned((Boolean) payload.get("pinned"));
        }
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Map<String, Object> payload) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Note not found with ID: " + id));

        if (payload.containsKey("title")) note.setTitle((String) payload.get("title"));
        if (payload.containsKey("content")) note.setContent((String) payload.get("content"));
        if (payload.containsKey("color")) note.setColor((String) payload.get("color"));
        if (payload.containsKey("pinned")) note.setPinned((Boolean) payload.get("pinned"));
        if (payload.containsKey("tags")) note.setTags((List<String>) payload.get("tags"));
        note.setUpdatedAt(LocalDateTime.now());

        return noteRepository.save(note);
    }

    public Note togglePin(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new InvalidTaskException("Note not found with ID: " + id));
        note.setPinned(!note.isPinned());
        note.setUpdatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    public List<Note> searchNotes(String query) {
        return noteRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query);
    }

    public void deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new InvalidTaskException("Note not found with ID: " + id);
        }
        noteRepository.deleteById(id);
    }
}
