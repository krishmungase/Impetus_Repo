const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor.model');

const doctorAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find doctor by id
    const doctor = await Doctor.findById(decoded._id);

    if (!doctor) {
      return res.status(401).json({ message: 'Doctor not found' });
    }

    // Attach doctor to request object
    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = doctorAuth; 