import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

// Create axios instance with base URL
const baseURL = import.meta.env.VITE_SERVER_URL || '';
const axiosInstance = axios.create({
  baseURL
});

// User API service with improved error handling
const userApi = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      // Ensure auth headers are included
      const headers = getAuthHeader();
      console.log('Fetching profile with headers:', headers);
      
      const response = await axiosInstance.get('/api/users/profile', { headers });
      console.log('Profile data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const headers = getAuthHeader();
      const response = await axiosInstance.patch('/api/users/profile', userData, { headers });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Book appointment
  bookAppointment: async (appointmentData) => {
    try {
      const headers = getAuthHeader();
      const response = await axiosInstance.post('/api/appointments/book', appointmentData, { headers });
      return response.data;
    } catch (error) {
      console.error('Book appointment error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user appointments
  getAppointments: async () => {
    try {
      const headers = getAuthHeader();
      const response = await axiosInstance.get('/api/users/appointments', { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  
  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      const headers = getAuthHeader();
      const response = await axiosInstance.delete(`/api/users/appointments/${appointmentId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Cancel appointment error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get doctors
  getDoctors: async () => {
    try {
      const response = await axiosInstance.get('/api/doctors');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching doctors:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default userApi;