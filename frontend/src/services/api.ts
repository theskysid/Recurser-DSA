import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor - send token in header if cookie might be blocked
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage as fallback
    const token = localStorage.getItem('jwt-token');
    if (token && token !== 'cookie-based-auth') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Cookies are still sent automatically with withCredentials: true
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
      const wasAuthenticated = localStorage.getItem('username') !== null;
      const currentPath = window.location.pathname;
      
      // Clear any local storage
      localStorage.removeItem('username');
      localStorage.removeItem('jwt-token');
      sessionStorage.clear();
      
      // Don't redirect if already on public pages or root
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(currentPath)) {
        // Only show "session expired" if user was previously authenticated
        const redirectUrl = wasAuthenticated ? '/login?session=expired' : '/login';
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  }
);

export default api;