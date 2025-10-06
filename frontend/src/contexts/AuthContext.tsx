import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUsername = authService.getUsername();
        
        if (token && storedUsername) {
          // Validate token with server
          const isValid = await authService.validateToken();
          if (isValid) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
          } else {
            // Token is invalid, clear auth state
            setIsAuthenticated(false);
            setUsername(null);
            await authService.logout();
          }
        } else {
          // No token or username, ensure clean state
          setIsAuthenticated(false);
          setUsername(null);
          await authService.logout();
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // On any error, clear auth state
        setIsAuthenticated(false);
        setUsername(null);
        await authService.logout();
      }
      
      setLoading(false);
    };

    validateAuth();
  }, []);

  const login = (token: string, username: string) => {
    authService.setAuthData(token, username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
  };

  const value = {
    isAuthenticated,
    username,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};