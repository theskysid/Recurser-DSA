package com.dsatracker.repository;

import com.dsatracker.entity.Question;
import com.dsatracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByUserOrderByPosition(User user);

    Optional<Question> findFirstByUserOrderByPosition(User user);

    @Query("SELECT MAX(q.position) FROM Question q WHERE q.user = :user")
    Optional<Long> findMaxPositionByUser(@Param("user") User user);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.user = :user")
    Long countByUser(@Param("user") User user);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.user = :user AND q.lastAttempt >= :startDate AND q.lastAttempt <= :endDate")
    Long countAttemptsInDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT q.topics FROM Question q WHERE q.user = :user")
    List<List<String>> findAllTopicsByUser(@Param("user") User user);
}