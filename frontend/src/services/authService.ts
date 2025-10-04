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

// Function to get token payload
const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

// Function to validate token belongs to current user
const validateTokenOwnership = (token: string, username: string): boolean => {
  try {
    const payload = getTokenPayload(token);
    return payload && payload.sub === username;
  } catch (error) {
    return false;
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

  // Force logout and clear all auth state
  forceLogout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    sessionStorage.clear();
    // Clear any cached authentication state
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clean up expired token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return false;
    }

    // Check if token belongs to the stored username
    if (!validateTokenOwnership(token, username)) {
      // Token doesn't match username, clean up
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return false;
    }
    
    return true;
  },

  getToken: (): string | null => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) return null;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clean up expired token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return null;
    }

    // Check if token belongs to the stored username
    if (!validateTokenOwnership(token, username)) {
      // Token doesn't match username, clean up
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
    // Validate that token belongs to username before storing
    if (!validateTokenOwnership(token, username)) {
      console.error('Token does not belong to username:', username);
      return;
    }
    
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