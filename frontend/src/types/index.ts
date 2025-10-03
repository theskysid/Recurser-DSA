export interface User {
  id: number;
  username: string;
}

export interface Question {
  id: number;
  number: number;
  name: string;
  topics: string[];
  link?: string;
  notes?: string;
  dateAdded: string;
  attemptCount: number;
  lastAttempt?: string;
  position: number;
}

export interface QuestionRequest {
  number: number;
  name: string;
  topics: string[];
  link?: string;
  notes?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  username: string;
}

export interface StatsResponse {
  totalQuestions: number;
  attemptsPerDay: Record<string, number>;
  topicDistribution: Record<string, number>;
}

export interface MessageResponse {
  message: string;
}