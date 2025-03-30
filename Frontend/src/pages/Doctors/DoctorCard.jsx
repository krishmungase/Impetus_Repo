import React from 'react';
import { 
  AcademicCapIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-0.5 text-xs font-semibold rounded-bl-lg z-10">
          {doctor.specialization || 'Specialist'}
        </div>
        <img
          src={doctor.image || 'https://i.pinimg.com/736x/21/fe/40/21fe40515f20276139fa2743372d33f5.jpg'}
          alt={`Dr. ${doctor.firstName || ''}`}
          className="h-full w-full object-cover object-center translate-y-2"
        />
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-2">
          <h2 className="text-base font-bold text-gray-800 mb-0.5 truncate">
            Dr. {doctor.firstName || ''} {doctor.lastName || ''}
          </h2>
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              MD
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Available
            </span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs text-gray-600 flex-grow">
          <div className="flex items-center">
            <BriefcaseIcon className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{doctor.specialization || 'Specialist'}</span>
          </div>
          
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span>{doctor.experience || '5+'} years experience</span>
          </div>
          
          <div className="flex items-center">
            <AcademicCapIcon className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{doctor.qualification || 'MBBS, MD'}</span>
          </div>
          
          <div className="flex items-center">
            <PhoneIcon className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{doctor.phone || 'Contact for appointment'}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
          <div className="flex -space-x-1">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-xs text-gray-700 font-medium">
              +99
            </div>
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-xs text-gray-700 font-medium">
              4.8
            </div>
          </div>
          <div className="text-xs font-medium text-blue-600 hover:text-blue-800">
            Accepting patients
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;