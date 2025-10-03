import api from './api';
import { Question, QuestionRequest, StatsResponse } from '../types';

export const questionService = {
  getAllQuestions: async (): Promise<Question[]> => {
    const response = await api.get('/api/questions');
    return response.data;
  },

  addQuestion: async (question: QuestionRequest): Promise<Question> => {
    const response = await api.post('/api/questions', question);
    return response.data;
  },

  reviseQuestion: async (id: number): Promise<Question> => {
    const response = await api.post(`/api/questions/${id}/revise`);
    return response.data;
  },

  getNextQuestion: async (): Promise<Question | null> => {
    try {
      const response = await api.get('/api/questions/next');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 204) {
        return null; // No content - no questions available
      }
      throw error;
    }
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get('/api/questions/stats');
    return response.data;
  },
};