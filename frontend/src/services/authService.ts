import api from './api';
import { LoginRequest, SignupRequest, JwtResponse, MessageResponse } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData: SignupRequest): Promise<MessageResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  setAuthData: (token: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },
};