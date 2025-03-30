const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to generate unique doctor ID from email
const generateDoctorId = (email) => {
  // Take first 3 letters of email username
  const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
  // Get current year
  const year = new Date().getFullYear().toString().slice(-2);
  // Generate random 3 digits
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DR${emailPrefix}${year}${randomNum}`;
};

const doctorSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    // it will be number of years
  },
  qualification: {
    type: String,
    trim: true,
  },
  license: {
    type: String,
    unique: true,
  },
  hospital: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  phone: {
    type: String,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
  }]
}, {
  timestamps: true,
});

// Generate doctor_id before saving
doctorSchema.pre('save', async function(next) {
  if (!this.doctor_id) {
    this.doctor_id = generateDoctorId(this.email);
  }
  next();
});

// Hash the password before saving
doctorSchema.pre('save', async function (next) {
  const doctor = this;
  if (doctor.isModified('password')) {
    doctor.password = await bcrypt.hash(doctor.password, 8);
  }
  next();
});

// Generate authentication token
doctorSchema.methods.generateAuthToken = async function () {
  const doctor = this;
  return jwt.sign({ _id: doctor._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Compare password method
doctorSchema.methods.comparePassword = async function (password) {
  const doctor = this;
  return bcrypt.compare(password, doctor.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 