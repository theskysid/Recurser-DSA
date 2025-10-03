package com.dsatracker.dto;

import java.util.Map;

public class StatsResponse {

    private Long totalQuestions;
    private Map<String, Long> attemptsPerDay;
    private Map<String, Long> topicDistribution;

    public StatsResponse() {
    }

    public StatsResponse(Long totalQuestions, Map<String, Long> attemptsPerDay, Map<String, Long> topicDistribution) {
        this.totalQuestions = totalQuestions;
        this.attemptsPerDay = attemptsPerDay;
        this.topicDistribution = topicDistribution;
    }

    public Long getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Map<String, Long> getAttemptsPerDay() {
        return attemptsPerDay;
    }

    public void setAttemptsPerDay(Map<String, Long> attemptsPerDay) {
        this.attemptsPerDay = attemptsPerDay;
    }

    public Map<String, Long> getTopicDistribution() {
        return topicDistribution;
    }

    public void setTopicDistribution(Map<String, Long> topicDistribution) {
        this.topicDistribution = topicDistribution;
    }
}