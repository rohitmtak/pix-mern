import axios from 'axios';
import { backendUrl } from '../App';

// Function to refresh admin token
export const refreshAdminToken = async () => {
  try {
    const response = await axios.post(backendUrl + '/api/user/refresh-token', {}, {
      withCredentials: true
    });
    
    if (response.data.success) {
      console.log('🔄 Admin token refreshed successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// Function to handle API calls with automatic token refresh
export const apiCallWithRefresh = async (apiCall, maxRetries = 1) => {
  try {
    return await apiCall();
  } catch (error) {
    // If it's an authentication error and we haven't exceeded max retries
    if (error.response?.status === 401 && maxRetries > 0) {
      console.log('🔄 Authentication failed, attempting token refresh...');
      
      const refreshSuccess = await refreshAdminToken();
      
      if (refreshSuccess) {
        // Retry the original API call
        return await apiCallWithRefresh(apiCall, maxRetries - 1);
      } else {
        // If refresh fails, throw the original error
        throw error;
      }
    }
    
    // If it's not an auth error or we've exceeded retries, throw the error
    throw error;
  }
};
