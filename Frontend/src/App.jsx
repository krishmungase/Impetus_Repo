import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DiseasePrediction from './pages/DiseasePrediction';
import HospitalMap from './pages/HospitalMap';
import Appointment from './pages/Appointment';
import MRIAnalysis from './pages/MRIAnalysis';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Doctors from './pages/Doctors/Doctors';
import { isAuthenticated, setupAxiosInterceptors } from './utils/auth';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Set up axios defaults and interceptors
  useEffect(() => {
    // Set base URL for API requests
    axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
    
    // Set up interceptors for authentication
    setupAxiosInterceptors(axios);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/disease-prediction" element={
              <ProtectedRoute>
                <DiseasePrediction />
              </ProtectedRoute>
            } />
            <Route path="/hospital-map" element={
              <ProtectedRoute>
                <HospitalMap />
              </ProtectedRoute>
            } />
            <Route path="/appointment" element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            } />
            <Route path="/mri-analysis" element={
              <ProtectedRoute>
                <MRIAnalysis />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#333333',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            style: {
              borderLeft: '4px solid #10B981',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
        }} />
      </div>
    </Router>
  );
}

export default App;