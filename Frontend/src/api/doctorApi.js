import axios from 'axios';

// Add response interceptor for consistent error handling
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message: errorMessage });
  }
);

// Doctor API service
const doctorApi = {
  // Register a new doctor
  register: async (doctorData) => {
    try {
      return await axios.post('/api/doctors/register', doctorData);
    } catch (error) {
      throw error;
    }
  },
  
  // Login doctor
  login: async (credentials) => {
    try {
      return await axios.post('/api/doctors/login', credentials);
    } catch (error) {
      throw error;
    }
  },
  
  // Get doctor profile
  getProfile: async () => {
    try {
      return await axios.get('/api/doctors/profile');
    } catch (error) {
      throw error;
    }
  },
  
  // Update doctor profile
  updateProfile: async (doctorData) => {
    try {
      return await axios.patch('/api/doctors/profile', doctorData);
    } catch (error) {
      throw error;
    }
  },

  // Get all doctors
  getAllDoctors: async () => {
    try {
      return await axios.get('/api/doctors');
    } catch (error) {
      throw error;
    }
  },

  // Get doctor by ID
  getDoctorById: async (doctorId) => {
    try {
      return await axios.get(`/api/doctors/${doctorId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get doctor's appointments
  getAppointments: async () => {
    try {
      return await axios.get('/api/doctors/appointments');
    } catch (error) {
      throw error;
    }
  },
  
  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      return await axios.patch(`/api/doctors/appointments/${appointmentId}`, { status });
    } catch (error) {
      throw error;
    }
  },
  
  // Update availability
  updateAvailability: async (availabilityData) => {
    try {
      return await axios.patch('/api/doctors/availability', availabilityData);
    } catch (error) {
      throw error;
    }
  },

  // Check doctor availability
  checkAvailability: async (doctorId, date) => {
    try {
      return await axios.get('/api/appointments/check-availability', {
        params: { doctor_id: doctorId, date }
      });
    } catch (error) {
      throw error;
    }
  },

  // Book appointment
  bookAppointment: async (appointmentData) => {
    try {
      return await axios.post('/api/appointments/book', appointmentData);
    } catch (error) {
      throw error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      return await axios.post(`/api/appointments/${appointmentId}/cancel`);
    } catch (error) {
      throw error;
    }
  },

  // Get doctor's free slots
  getFreeSlots: async (doctorId, date) => {
    try {
      return await axios.get('/api/appointments/doctor/free-slots', {
        params: { doctor_id: doctorId, date }
      });
    } catch (error) {
      throw error;
    }
  }
};

export default doctorApi; 