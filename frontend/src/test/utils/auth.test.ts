import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getToken, logout, isAuthenticated } from '@/utils/auth';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Auth Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'mock-jwt-token';
      localStorageMock.getItem.mockReturnValue(mockToken);

      const result = getToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getToken();
      
      expect(result).toBeNull();
    });

    it('should return empty string when localStorage returns empty string', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = getToken();
      
      expect(result).toBe('');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when valid token exists', () => {
      const mockToken = 'valid-jwt-token';
      localStorageMock.getItem.mockReturnValue(mockToken);

      const result = isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isAuthenticated();
      
      expect(result).toBe(false);
    });

    it('should return false when empty token exists', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = isAuthenticated();
      
      expect(result).toBe(false);
    });

    it('should return false when token is undefined', () => {
      localStorageMock.getItem.mockReturnValue(undefined);

      const result = isAuthenticated();
      
      expect(result).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should work together: get, check authentication, and logout', () => {
      const token = 'integration-test-token';
      
      // Simulate token exists in localStorage
      localStorageMock.getItem.mockReturnValue(token);
      
      // Get token
      const retrievedToken = getToken();
      expect(retrievedToken).toBe(token);
      
      // Check authentication
      const authenticated = isAuthenticated();
      expect(authenticated).toBe(true);
      
      // Logout
      logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      
      // Check authentication after logout
      localStorageMock.getItem.mockReturnValue(null);
      const notAuthenticated = isAuthenticated();
      expect(notAuthenticated).toBe(false);
    });
  });
});
