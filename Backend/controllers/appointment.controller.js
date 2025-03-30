const Appointment = require('../models/appointment.model');
const TimeSlot = require('../models/timeSlot.model');
const Doctor = require('../models/doctor.model');

const appointmentController = {
  // Check doctor's availability for a specific date - modified to always return available slots
  checkAvailability: async (req, res) => {
    try {
      const { doctor_id, date } = req.query;

      // Find doctor 
      console.log(doctor_id,date)
      const doctor = await Doctor.findOne({ doctor_id:doctor_id });
      console.log(doctor)
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Return default available time slots from 9 AM to 5 PM
      const defaultSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        defaultSlots.push({
          doctor_id,
          date: new Date(date),
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isAvailable: true
        });
      }

      res.json(defaultSlots);
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error: error.message });
    }
  },

  // Book an appointment - modified to bypass time slot verification
  bookAppointment: async (req, res) => {
    try {
      const { doctor_id, date, time, type, notes } = req.body;
      const user_id = req.user._id;

      // Find doctor
      const doctor = await Doctor.findOne({ doctor_id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Skip time slot verification - all doctors are available at all times
      
      // Generate a unique appointment ID
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const appointment_id = `APT${year}${month}${randomNum}`;
      
      // Create appointment with explicit appointment_id
      const appointment = new Appointment({
        appointment_id,
        doctor_id,
        user_id,
        date: new Date(date),
        time,
        type,
        notes,
        amount: doctor.consultationFee || 0 // Default to 0 if consultationFee isn't set
      });

      await appointment.save();

      res.status(201).json({
        message: 'Appointment booked successfully',
        appointment: {
          appointment_id: appointment.appointment_id,
          doctor_id: appointment.doctor_id,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          amount: appointment.amount
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
  },

  // Cancel an appointment - simplified to not update time slots
  cancelAppointment: async (req, res) => {
    try {
      const { appointment_id } = req.params;
      const user_id = req.user._id;

      const appointment = await Appointment.findOne({
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
  },

  // Get doctor's free slots for a specific date - modified to always return available slots
  getDoctorFreeSlots: async (req, res) => {
    try {
      const { doctor_id } = req.params;
      const { date } = req.query;

      // Return default available time slots from 9 AM to 5 PM
      const defaultSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        defaultSlots.push({
          doctor_id,
          date: new Date(date),
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isAvailable: true
        });
      }

      res.json(defaultSlots);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching free slots', error: error.message });
    }
  }
};

module.exports = appointmentController; 