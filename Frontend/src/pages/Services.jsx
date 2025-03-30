import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  BeakerIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserGroupIcon,
  PhoneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import LogoutButton from '../components/LogoutButton';

const services = [
  {
    name: 'Disease Prediction',
    description: 'Advanced AI-powered disease prediction system that analyzes symptoms and medical history to provide accurate diagnoses.',
    icon: BeakerIcon,
    link: '/disease-prediction',
    color: 'bg-blue-500',
  },
  {
    name: 'Hospital Locator',
    description: 'Find nearby hospitals and healthcare facilities with detailed information about services, ratings, and availability.',
    icon: MapPinIcon,
    link: '/hospital-map',
    color: 'bg-green-500',
  },
  {
    name: 'MRI Analysis',
    description: 'AI-powered MRI scan analysis system that helps in detecting abnormalities and providing detailed reports.',
    icon: BeakerIcon,
    link: '/mri-analysis',
    color: 'bg-purple-500',
  },
  {
    name: 'Medical Chatbot',
    description: '24/7 AI-powered medical chatbot that provides instant answers to your health-related queries.',
    icon: ChatBubbleLeftRightIcon,
    link: 'http://127.0.0.1:8080/',
    color: 'bg-yellow-500',
    isExternal: true,
  },
  {
    name: 'Appointment Booking',
    description: 'Easy and convenient appointment booking system with real-time availability and instant confirmation.',
    icon: CalendarIcon,
    link: '/appointment',
    color: 'bg-red-500',
  },
  
];

export default function Services() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (authStatus) {
        setUser(getCurrentUser());
      }
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Healthcare Services</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover our comprehensive range of healthcare services designed to provide you with the best medical care and support.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${service.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-6`}>
                <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-gray-900">{service.name}</h3>
              <p className="mt-4 text-base leading-7 text-gray-600">{service.description}</p>
              <div className="mt-6">
                {service.isExternal ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold leading-6 text-primary-600 hover:text-primary-500"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link
                    to={service.link}
                    className="text-sm font-semibold leading-6 text-primary-600 hover:text-primary-500"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 