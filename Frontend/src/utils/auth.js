// Auth utilities for managing tokens and user data

// Get the stored token (from either localStorage or sessionStorage)
export const getToken = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token;
};

// Get the current user data
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout the user (clear all auth data)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

// Get authorization header with Bearer token
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user type (user or doctor)
export const getUserType = () => {
  const user = getCurrentUser();
  // Check if user has doctor-specific fields like specialization or license
  if (user?.specialization || user?.license) {
    return 'doctor';
  }
  return 'user';
};

// Add a token interceptor for Axios
export const setupAxiosInterceptors = (axios) => {
  // Log interceptor setup
  console.log('Setting up Axios interceptors');
  
  // Add request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`Request to ${config.url}: Token attached`);
      } else {
        console.log(`Request to ${config.url}: No token available`);
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Handle token expiration
  axios.interceptors.response.use(
    (response) => {
      console.log(`Response from ${response.config.url}: Status ${response.status}`);
      return response;
    },
    (error) => {
      console.error('Response error:', error.response?.status, error.config?.url);
      
      // Only logout on specific 401 unauthorized errors
      if (error.response?.status === 401 && error.response?.data?.message === 'Token expired') {
        console.log('Token expired, logging out');
        logout();
        window.location.href = '/login?session=expired';
      }
      return Promise.reject(error);
    }
  );
}; 