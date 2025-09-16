import axios, { AxiosError, AxiosResponse } from 'axios';
import { logout } from './auth';
import { showToast } from '@/config/toastConfig';
import { config } from '@/config/env';

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true, // Enable cookies for httpOnly tokens
});

// Flag to prevent multiple session expired toasts
let sessionExpiredToastShown = false;

// Function to reset the session expired toast flag (call after successful login)
export const resetSessionExpiredFlag = () => {
  sessionExpiredToastShown = false;
};

// Request interceptor - no need to add token manually with httpOnly cookies
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      const errorMessage = (error.response?.data as any)?.message || '';
      
      // Check if it's a JWT expiration error
      if (errorMessage.toLowerCase().includes('expired') || 
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('not authorized')) {
        
        // Try to refresh the token if this is the first attempt
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshResponse = await axios.post(`${config.api.baseUrl}/user/refresh-token`, {}, {
              withCredentials: true
            });
            
            if (refreshResponse.data?.success) {
              // Retry the original request
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        // If refresh failed or this is a retry, don't logout here
        // Let the component handle authentication errors appropriately
        // This prevents unwanted redirects during intentional logout
        
        return Promise.reject(error);
      }
    }
    
    // For other errors, just reject normally
    return Promise.reject(error);
  }
);

export default apiClient;
