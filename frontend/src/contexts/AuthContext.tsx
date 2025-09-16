import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated as checkAuthStatus } from '@/utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkAuth = async () => {
    // Prevent multiple simultaneous checks
    if (isChecking) {
      return;
    }
    
    setIsChecking(true);
    let authenticated = false;
    try {
      authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Only set to false if it's a clear authentication error, not a network error
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        setIsAuthenticated(false);
      } else {
        // For network errors, keep the current state to avoid false negatives
        // This is especially important in production where network issues might occur
        console.warn('Network error during auth check, keeping current state');
        // Don't change the authentication state on network errors
      }
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
