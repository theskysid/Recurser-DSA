import api from './api';
import { LoginRequest, SignupRequest, JwtResponse, MessageResponse } from '../types';

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't decode, consider it expired
  }
};

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
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clean up expired token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return false;
    }
    
    return true;
  },

  getToken: (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clean up expired token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return null;
    }
    
    return token;
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  setAuthData: (token: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },

  // Method to validate token with server
  validateToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        return false;
      }
      
      // Try to make a request to validate token
      await api.get('/api/questions');
      return true;
    } catch (error) {
      // Token is invalid, clean up
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return false;
    }
  },
};