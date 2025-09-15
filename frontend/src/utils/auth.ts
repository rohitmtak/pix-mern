// Enhanced auth utility for httpOnly cookie-based authentication
// Since tokens are now stored in httpOnly cookies, we can't access them directly
// We'll use API calls to check authentication status

// Helper function to check if user is authenticated by making an API call
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/user/me', {
      method: 'GET',
      credentials: 'include', // Include httpOnly cookies
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication:', error);
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
    // Call logout endpoint to clear httpOnly cookie
    await fetch('/api/user/logout', {
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