// Enhanced auth utility for httpOnly cookie-based authentication
// Since tokens are now stored in httpOnly cookies, we can't access them directly
// We'll use API calls to check authentication status

// Debounce mechanism to prevent multiple rapid authentication checks
let authCheckPromise: Promise<boolean> | null = null;
let lastAuthCheck = 0;
const AUTH_CHECK_COOLDOWN = 2000; // 2 seconds

// Helper function to check if user is authenticated by making an API call
export const isAuthenticated = async (): Promise<boolean> => {
  const now = Date.now();
  
  // If we have a recent check and it's still running, return that promise
  if (authCheckPromise && (now - lastAuthCheck) < AUTH_CHECK_COOLDOWN) {
    return authCheckPromise;
  }
  
  // Create new authentication check
  authCheckPromise = performAuthCheck();
  lastAuthCheck = now;
  
  try {
    const result = await authCheckPromise;
    return result;
  } finally {
    // Clear the promise after completion
    authCheckPromise = null;
  }
};

const performAuthCheck = async (): Promise<boolean> => {
  try {
    // Use the configured API base URL instead of hardcoded path
    const apiBaseUrl = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'https://pix-mern-production.up.railway.app/api');
    const response = await fetch(`${apiBaseUrl}/user/me`, {
      method: 'GET',
      credentials: 'include', // Include httpOnly cookies
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    // Check if response is ok and has valid data
    if (response.ok) {
      const data = await response.json();
      return data.success === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    // Return false for any error (network, timeout, etc.)
    return false;
  }
};

// Get authentication status synchronously (for immediate checks)
export const isAuthenticatedSync = (): boolean => {
  // Since we can't access httpOnly cookies directly, we'll assume
  // the user is authenticated if they're on a protected page
  // The actual validation happens server-side
  return true; // This will be validated by the server on each request
};

export const getToken = (): string | null => {
  // With httpOnly cookies, we can't access the token directly
  // The token is automatically sent with requests
  return null;
};

export const logout = async (): Promise<void> => {
  try {
    // Use the configured API base URL instead of hardcoded path
    const apiBaseUrl = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'https://pix-mern-production.up.railway.app/api');
    await fetch(`${apiBaseUrl}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
  
  // Clear any other user-related data from localStorage
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
};

// Legacy functions for compatibility (now deprecated)
export const isTokenExpired = (token: string): boolean => {
  console.warn('isTokenExpired is deprecated with httpOnly cookies');
  return true;
};

export const getTokenExpirationTime = (token: string): number | null => {
  console.warn('getTokenExpirationTime is deprecated with httpOnly cookies');
  return null;
};

export const getTimeUntilExpiration = (token: string): number => {
  console.warn('getTimeUntilExpiration is deprecated with httpOnly cookies');
  return 0;
};