import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';

const DoctorDetails = ({ doctor, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/appointments/check-availability?doctor_id=${doctor.doctor_id}&date=${selectedDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      const data = await response.json();
      setAvailableSlots(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Doctors
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Specialization
                </h3>
                <p className="text-gray-600">{doctor.specialization}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Experience
                </h3>
                <p className="text-gray-600">{doctor.experience} years</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Qualification
                </h3>
                <p className="text-gray-600">{doctor.qualification}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Hospital</h3>
                <p className="text-gray-600">{doctor.hospital}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">
                  {doctor.address?.street}, {doctor.address?.city},{' '}
                  {doctor.address?.state}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                <p className="text-gray-600">{doctor.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Book Appointment
            </h3>
            <AppointmentForm
              doctor={doctor}
              availableSlots={availableSlots}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;