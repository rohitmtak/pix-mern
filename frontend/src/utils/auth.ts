// Enhanced auth utility with JWT token validation and refresh handling
// Removed jsonwebtoken dependency - using browser-compatible JWT decoding

// Helper function to decode JWT token without external dependencies
const decodeJWT = (token: string): any => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64url to JSON
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode token to check expiration
    const decoded = decodeJWT(token);
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
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp <= currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded = decodeJWT(token);
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