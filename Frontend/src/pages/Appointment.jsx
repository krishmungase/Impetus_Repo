import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/userApi';
import { getCurrentUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import {
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Appointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    // Get current user data and prefill the form
    const user = getCurrentUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
    
    // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
        setFetchingDoctors(true);
        
        // Use the new getDoctors method from userApi
        const doctorsData = await userApi.getDoctors();
        setDoctors(doctorsData);
        
        // Extract unique departments from doctors' specializations
        const uniqueDepartments = Array.from(
          new Set(doctorsData.map(doctor => doctor.specialization))
        ).sort();
        
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors. Using fallback data.');
        // Fallback to hardcoded doctors if API fails
        const fallbackDoctors = [
          {
            firstName: "John",
            lastName: "Smith",
            specialization: "General Medicine",
            doctor_id: "DRJOH25693"
          },
          {
            firstName: "Sarah",
            lastName: "Johnson",
            specialization: "Cardiology",
            doctor_id: "DRSAR25732"
          },
          {
            firstName: "Michael",
            lastName: "Brown",
            specialization: "Orthopedics",
            doctor_id: "DRMIC25131"
          },
          {
            firstName: "Emily",
            lastName: "Davis",
            specialization: "Pediatrics",
            doctor_id: "DREMI25784"
          },
          {
            firstName: "Robert",
            lastName: "Wilson",
            specialization: "Dermatology",
            doctor_id: "DRROB25800"
          }
        ];
        
        setDoctors(fallbackDoctors);
        
        // Extract departments from fallback doctors
        const fallbackDepartments = Array.from(
          new Set(fallbackDoctors.map(doctor => doctor.specialization))
        ).sort();
        
        setDepartments(fallbackDepartments);
      } finally {
        setFetchingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Filter doctors based on selected department
  const filteredDoctors = formData.department 
    ? doctors.filter(doctor => doctor.specialization === formData.department)
    : doctors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Get user info
      const user = getCurrentUser();
      if (!user) {
        toast.error('You must be logged in to book an appointment');
        navigate('/login');
        return;
      }
      
      // Prepare appointment data
      const appointmentData = {
        doctor_id: formData.doctor, // Now using the real doctor_id from the database
        date: formData.date,
        time: formData.time,
        type: 'regular',
        notes: formData.reason
      };
      
      // Use userApi to book appointment
      await userApi.bookAppointment(appointmentData);
      
      // Show success toast
      toast.success('Appointment booked successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header section with elegant design */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <CalendarIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <div className="h-1 w-20 bg-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-md mx-auto">
            Schedule a consultation with our healthcare specialists and take the first step towards better health.
          </p>
        </div>

        {/* Card containing the form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Appointment Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2 text-primary-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <BuildingOffice2Icon className="h-5 w-5 mr-2 text-primary-500" />
                Medical Department & Doctor
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    disabled={fetchingDoctors}
                    className="block w-full py-2 px-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && (
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading departments...
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Doctor
                  </label>
                  <select
                    id="doctor"
                    name="doctor"
                    required
                    value={formData.doctor}
                    onChange={handleChange}
                    disabled={fetchingDoctors || !formData.department}
                    className="block w-full py-2 px-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select doctor</option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && (
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading doctors...
                    </div>
                  )}
                  {!fetchingDoctors && formData.department && filteredDoctors.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">No doctors available in this department</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-primary-500" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-primary-500" />
                Reason for Visit
              </h3>
              <div>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or the reason for your consultation..."
                  className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || fetchingDoctors}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Schedule Appointment'
                )}
              </button>
            </div>
            
            {/* Privacy Note */}
            <p className="mt-4 text-xs text-center text-gray-500">
              By scheduling an appointment, you agree to our privacy policy and terms of service.
              Your personal information will be handled according to our privacy guidelines.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 