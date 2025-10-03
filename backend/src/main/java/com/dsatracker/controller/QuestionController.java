package com.dsatracker.controller;

import com.dsatracker.dto.QuestionRequest;
import com.dsatracker.dto.StatsResponse;
import com.dsatracker.entity.Question;
import com.dsatracker.entity.User;
import com.dsatracker.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Question> questions = questionService.getAllQuestionsByUser(user);
        return ResponseEntity.ok(questions);
    }

    @PostMapping
    public ResponseEntity<Question> addQuestion(@Valid @RequestBody QuestionRequest questionRequest,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Question question = new Question();
        question.setNumber(questionRequest.getNumber());
        question.setName(questionRequest.getName());
        question.setTopics(questionRequest.getTopics());
        question.setLink(questionRequest.getLink());
        question.setNotes(questionRequest.getNotes());
        question.setDateAdded(LocalDateTime.now());

        Question savedQuestion = questionService.saveQuestion(question, user);
        return ResponseEntity.ok(savedQuestion);
    }

    @PostMapping("/{id}/revise")
    public ResponseEntity<Question> reviseQuestion(@PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        try {
            Question revisedQuestion = questionService.reviseQuestion(id, user);
            return ResponseEntity.ok(revisedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/next")
    public ResponseEntity<Question> getNextQuestionToRevise(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Optional<Question> nextQuestion = questionService.getNextQuestionToRevise(user);
        if (nextQuestion.isPresent()) {
            return ResponseEntity.ok(nextQuestion.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        StatsResponse stats = questionService.getStats(user);
        return ResponseEntity.ok(stats);
    }
}