package com.daymind.controller;

import com.daymind.model.Note;
import com.daymind.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotes() {
        List<Note> notes = noteService.getAllNotes();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", notes.size());
        response.put("notes", notes);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNote(@RequestBody Map<String, Object> payload) {
        Note note = noteService.createNote(payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("note", note);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNote(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Note note = noteService.updateNote(id, payload);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("note", note);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/pin")
    public ResponseEntity<Map<String, Object>> togglePin(@PathVariable Long id) {
        Note note = noteService.togglePin(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("note", note);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchNotes(@RequestParam String q) {
        List<Note> notes = noteService.searchNotes(q);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notes", notes);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Note deleted.");
        return ResponseEntity.ok(response);
    }
}
