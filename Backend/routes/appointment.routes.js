const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/userAuth');
const { doctorAuth } = require('../middleware/doctorAuth');
const appointmentController = require('../controllers/appointment.controller');

// Public routes
router.get('/check-availability', appointmentController.checkAvailability);

// Protected routes (require user authentication)
router.post('/book', authenticateUser, appointmentController.bookAppointment);
router.delete('/cancel/:appointment_id', authenticateUser, appointmentController.cancelAppointment);

// Protected routes (require doctor authentication)
router.get('/doctor/:doctor_id/free-slots', appointmentController.getDoctorFreeSlots);

module.exports = router; 