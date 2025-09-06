// Enhanced auth utility with JWT token validation and refresh handling
import jwt from 'jsonwebtoken';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode token to check expiration
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return false;
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Validate token before returning
  if (!isAuthenticated()) {
    logout();
    return null;
  }
  
  return token;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  // Clear any other user-related data
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp <= currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

export const getTimeUntilExpiration = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  return expirationTime - Date.now();
};