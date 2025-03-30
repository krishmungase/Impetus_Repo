import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import DoctorDetails from './DoctorDetails';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/doctors`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {selectedDoctor ? (
        <DoctorDetails
          doctor={selectedDoctor}
          onBack={() => setSelectedDoctor(null)}
        />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Doctors</h1>
          {doctors.length === 0 ? (
            <div className="text-center text-gray-600">
              No doctors available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctor_id}
                  doctor={doctor}
                  onSelect={() => setSelectedDoctor(doctor)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Doctors;