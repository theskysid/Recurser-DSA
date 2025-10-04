import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      // Additional validation: check if token belongs to stored username
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.sub === username) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token doesn't match username, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          throw new Error('Token ownership mismatch');
        }
      } catch (error) {
        // Invalid token format, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      sessionStorage.clear();
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;