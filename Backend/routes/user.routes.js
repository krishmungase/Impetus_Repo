const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authenticateUser } = require('../middleware/userAuth');
const appointmentController = require('../controllers/appointment.controller');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/profile', authenticateUser, getUserProfile);
router.patch('/profile', authenticateUser, updateUserProfile);

// Appointment routes for users
router.get('/appointments', authenticateUser, async (req, res) => {
  try {
    const user_id = req.user._id;
    const appointments = await require('../models/appointment.model').find({ user_id }).sort({ date: -1 });
    
    // Process appointments - mark past appointments as completed
    const currentDate = new Date();
    const processedAppointments = await Promise.all(appointments.map(async (appointment) => {
      // Check if appointment is in the past and still marked as scheduled
      const appointmentDateTime = new Date(`${appointment.date.toISOString().split('T')[0]}T${appointment.time}`);
      
      if (appointmentDateTime < currentDate && appointment.status === 'scheduled') {
        // Update the appointment status in the database
        appointment.status = 'completed';
        await appointment.save();
      }
      
      return appointment;
    }));
    
    res.json(processedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

router.delete('/appointments/:id', authenticateUser, async (req, res) => {
  try {
    const appointment_id = req.params.id;
    const user_id = req.user._id;
    
    const appointment = await require('../models/appointment.model').findOne({
      appointment_id,
      user_id,
      status: 'scheduled'
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or cannot be cancelled' });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

module.exports = router;