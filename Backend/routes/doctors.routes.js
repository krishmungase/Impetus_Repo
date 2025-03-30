const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getDoctorById
} = require('../controllers/doctor.controller');
const { doctorAuth } = require('../middleware/doctorAuth');

// Public routes
router.get('/', getAllDoctors); // Get all doctors
router.get('/:id', getDoctorById); // Get doctor by ID
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// Protected routes
router.post('/logout', logoutDoctor);
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);

module.exports = router; 