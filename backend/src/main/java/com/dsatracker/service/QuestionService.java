package com.dsatracker.service;

import com.dsatracker.dto.StatsResponse;
import com.dsatracker.entity.Question;
import com.dsatracker.entity.User;
import com.dsatracker.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestionsByUser(User user) {
        return questionRepository.findByUserOrderByPosition(user);
    }

    public Question saveQuestion(Question question, User user) {
        question.setUser(user);

        // Set position to the end of the queue
        Optional<Long> maxPosition = questionRepository.findMaxPositionByUser(user);
        question.setPosition(maxPosition.orElse(0L) + 1);

        return questionRepository.save(question);
    }

    public Optional<Question> getNextQuestionToRevise(User user) {
        return questionRepository.findFirstByUserOrderByPosition(user);
    }

    public Question reviseQuestion(Long questionId, User user) {
        Optional<Question> questionOpt = questionRepository.findById(questionId);

        if (questionOpt.isPresent()) {
            Question question = questionOpt.get();

            // Verify the question belongs to the user
            if (!question.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Question does not belong to user");
            }

            // Increment attempt count and update last attempt
            question.setAttemptCount(question.getAttemptCount() + 1);
            question.setLastAttempt(LocalDateTime.now());

            // Move to end of queue
            Optional<Long> maxPosition = questionRepository.findMaxPositionByUser(user);
            question.setPosition(maxPosition.orElse(0L) + 1);

            return questionRepository.save(question);
        }

        throw new RuntimeException("Question not found");
    }

    public StatsResponse getStats(User user) {
        Long totalQuestions = questionRepository.countByUser(user);

        // Get attempts per day for the last 7 days
        Map<String, Long> attemptsPerDay = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime startOfDay = now.minusDays(i).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = startOfDay.withHour(23).withMinute(59).withSecond(59).withNano(999999999);

            Long attempts = questionRepository.countAttemptsInDateRange(user, startOfDay, endOfDay);
            attemptsPerDay.put(startOfDay.toLocalDate().toString(), attempts);
        }

        // Get topic distribution
        Map<String, Long> topicDistribution = new HashMap<>();
        List<List<String>> allTopics = questionRepository.findAllTopicsByUser(user);

        for (List<String> topics : allTopics) {
            if (topics != null) {
                for (String topic : topics) {
                    topicDistribution.put(topic, topicDistribution.getOrDefault(topic, 0L) + 1);
                }
            }
        }

        return new StatsResponse(totalQuestions, attemptsPerDay, topicDistribution);
    }
}