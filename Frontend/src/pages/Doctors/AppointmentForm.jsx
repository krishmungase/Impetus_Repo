import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentForm = ({ doctor, availableSlots, selectedDate, setSelectedDate, loading, error }) => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setBookingError('Please select both date and time slot');
      return;
    }

    try {
      setIsBooking(true);
      setBookingError(null);

      const appointmentData = {
        doctor_id: doctor.doctor_id,
        date: selectedDate,
        time: selectedSlot,
      };

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      setBookingSuccess(true);
      setBookingError(null);

      setTimeout(() => {
        setSelectedDate('');
        setSelectedSlot('');
        setBookingSuccess(false);
      }, 3000);
    } catch (err) {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      setBookingError(err.message || 'Failed to book appointment');
      setBookingSuccess(false);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bookingSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Appointment booked successfully!
        </div>
      )}

      {bookingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {bookingError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot('');
          }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : availableSlots.length > 0 ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time Slot
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`p-2 text-sm rounded-md border ${
                  selectedSlot === slot
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      ) : selectedDate ? (
        <div className="text-gray-600 text-sm">
          No available slots for this date
        </div>
      ) : null}

      <div className="pt-4">
        <button
          type="submit"
          disabled={!selectedDate || !selectedSlot || loading || isBooking}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            !selectedDate || !selectedSlot || loading || isBooking
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isBooking ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        <p>Consultation Fee: ₹{doctor.consultationFee}</p>
        <p>Duration: 45 minutes</p>
      </div>
    </form>
  );
};

export default AppointmentForm;