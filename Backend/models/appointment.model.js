const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    unique: true,
    required: true
  },
  doctor_id: {
    type: String,
    required: true,
    ref: 'Doctor'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['regular', 'follow-up', 'emergency'],
    default: 'regular'
  },
  notes: {
    type: String,
    trim: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Generate unique appointment ID
appointmentSchema.pre('save', async function(next) {
  if (!this.appointment_id) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.appointment_id = `APT${year}${month}${randomNum}`;
  }
  next();
});

// Indexes for better query performance
appointmentSchema.index({ doctor_id: 1, date: 1 });
appointmentSchema.index({ user_id: 1, date: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 