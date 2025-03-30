import { Link } from 'react-router-dom';
import { LightBulbIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HealthSphere</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revolutionizing Healthcare with AI - Making quality healthcare accessible to everyone through innovative technology solutions.
          </p>
        </div>

        {/* Mission, Vision, and Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mission Box */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4 mx-auto">
              <LightBulbIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Our Mission</h3>
            <p className="text-gray-600 text-center">
              To make healthcare more accessible and efficient through innovative technology solutions, ensuring quality care for all.
            </p>
          </div>

          {/* Vision Box */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4 mx-auto">
              <EyeIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Our Vision</h3>
            <p className="text-gray-600 text-center">
              To become the leading platform for AI-powered healthcare solutions, improving lives worldwide through accessible and accurate medical care.
            </p>
          </div>

          {/* Values Box */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4 mx-auto">
              <HeartIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Our Values</h3>
            <p className="text-gray-600 text-center">
              Innovation, Accessibility, Accuracy, and Patient-Centric Care are at the heart of everything we do.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
} 