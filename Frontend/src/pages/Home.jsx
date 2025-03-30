import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Personalized Care',
    description: 'Experience healthcare tailored to your unique needs with our advanced AI-powered personalization system.',
    icon: HeartIcon,
  },
  {
    name: 'Quality Assurance',
    description: 'Rest assured with our commitment to delivering the highest standards of medical care and service.',
    icon: ShieldCheckIcon,
  },
  {
    name: '24/7 Availability',
    description: 'Access healthcare services round the clock with our dedicated support team and automated systems.',
    icon: ClockIcon,
  },
  {
    name: 'Expert Network',
    description: 'Connect with a network of experienced healthcare professionals and specialists.',
    icon: UserGroupIcon,
  },
  {
    name: 'Health Analytics',
    description: 'Track your health metrics and get personalized insights for better well-being.',
    icon: ChartBarIcon,
  },
  {
    name: 'Innovative Solutions',
    description: 'Stay ahead with cutting-edge medical technologies and treatment approaches.',
    icon: SparklesIcon,
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-8 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Health, Our Priority
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the future of healthcare with our comprehensive medical platform. We combine cutting-edge technology with compassionate care to provide you with the best healthcare experience.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/services"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Explore Services
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-primary-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Healthcare Solutions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide a complete healthcare ecosystem that combines technology, expertise, and personalized care to ensure your well-being.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Chatbot Preview Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">AI Assistant</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Personal Health Guide
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get instant answers to your health-related questions with our AI-powered medical chatbot.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">AI</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Hello! I'm your AI health assistant. How can I help you today?</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">You</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">What are the common symptoms of COVID-19?</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">AI</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Common symptoms include fever, cough, shortness of breath, fatigue, and loss of taste or smell. Would you like to know more about any specific symptom?</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="http://127.0.0.1:8080/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Try the Chatbot <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 