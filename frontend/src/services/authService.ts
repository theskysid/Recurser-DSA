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
    // Store token as backup in case cookies are blocked
    if (response.data.token) {
      localStorage.setItem('jwt-token', response.data.token);
    }
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
      // Clear username AND token from localStorage
      localStorage.removeItem('username');
      localStorage.removeItem('jwt-token');
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
      localStorage.removeItem('jwt-token');
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
    // Try cookie first, then localStorage as fallback
    const cookieToken = hasAuthCookie() ? 'cookie-based-auth' : null;
    if (cookieToken) return cookieToken;
    
    // Fallback to localStorage if cookies are blocked
    return localStorage.getItem('jwt-token');
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  setAuthData: (token: string, username: string) => {
    // Store both token and username as fallback
    localStorage.setItem('jwt-token', token);
    localStorage.setItem('username', username);
  },

  // Method to validate token with server
  validateToken: async (): Promise<boolean> => {
    try {
      // Check if we have any auth method available
      if (!hasAuthCookie() && !localStorage.getItem('jwt-token')) {
        return false;
      }
      
      // Make a test request - will use cookie or header automatically
      await api.get('/api/questions');
      return true;
    } catch (error) {
      // Token is invalid, clean up
      localStorage.removeItem('username');
      localStorage.removeItem('jwt-token');
      return false;
    }
  },
};