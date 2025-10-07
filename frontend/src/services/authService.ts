import api from './api';
import { LoginRequest, SignupRequest, JwtResponse, MessageResponse } from '../types';

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Function to check if token exists in cookie
const hasAuthCookie = (): boolean => {
  return getCookie('jwt-token') !== null;
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    // JWT is automatically stored in HTTP-only cookie by backend
    // We only need to store the username for display purposes
    return response.data;
  },

  register: async (userData: SignupRequest): Promise<MessageResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear username from localStorage
      localStorage.removeItem('username');
      sessionStorage.clear();
    }
  },

  // Force logout and clear all auth state
  forceLogout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Force logout error:', error);
    } finally {
      localStorage.removeItem('username');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  },

  isAuthenticated: (): boolean => {
    // Primary check: username in localStorage indicates intent to be logged in
    const username = localStorage.getItem('username');
    return username !== null;
  },

  getToken: (): string | null => {
    // JWT is in HTTP-only cookie, not accessible from JavaScript
    // This method is kept for compatibility but returns cookie existence
    return hasAuthCookie() ? 'cookie-based-auth' : null;
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  setAuthData: (_token: string, username: string) => {
    // JWT is already in cookie, we only store username
    // _token parameter kept for compatibility but not used
    localStorage.setItem('username', username);
  },

  // Method to validate token with server
  validateToken: async (): Promise<boolean> => {
    try {
      // Check if we even have a cookie before making request
      if (!hasAuthCookie()) {
        return false;
      }
      
      // Cookie is sent automatically, just make a test request
      await api.get('/api/questions');
      return true;
    } catch (error) {
      // Token is invalid, clean up
      localStorage.removeItem('username');
      return false;
    }
  },
};