const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,  // Format: "HH:mm"
    required: true
  },
  endTime: {
    type: String,  // Format: "HH:mm"
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isLunchBreak: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
timeSlotSchema.index({ doctorId: 1, date: 1 });
timeSlotSchema.index({ isAvailable: 1 });

// Method to check if slot is in the past
timeSlotSchema.methods.isPastSlot = function() {
  const slotDate = new Date(this.date);
  const slotTime = this.startTime.split(':');
  slotDate.setHours(parseInt(slotTime[0]), parseInt(slotTime[1]), 0);
  return slotDate < new Date();
};

// Static method to generate slots for a doctor
timeSlotSchema.statics.generateSlots = async function(doctorId, date, workingHours) {
  const slots = [];
  let currentTime = workingHours.start;

  while (currentTime < workingHours.end) {
    const isLunchBreak = currentTime === workingHours.lunchStart;
    const endTime = isLunchBreak ? workingHours.lunchEnd : 
      addMinutes(currentTime, 45);

    slots.push({
      doctorId,
      date,
      startTime: currentTime,
      endTime,
      isAvailable: true,
      isLunchBreak
    });

    currentTime = endTime;
  }

  return this.insertMany(slots);
};

// Helper function to add minutes to time string
function addMinutes(timeStr, minutes) {
  const [hours, mins] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Pre-save middleware to update updatedAt timestamp
timeSlotSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot; 