# IMPETUS Healthcare Platform

## Overview
IMPETUS is a comprehensive healthcare platform that integrates various medical services including appointment scheduling, MRI analysis, hospital location, and medical consultations.

## Features
- User and doctor authentication
- Appointment scheduling and management
- MRI scan analysis for brain tumor detection
- Hospital locator with interactive map
- Medical chatbot for health-related queries

## Backend Structure

### Models
- **User Model**: Manages patient information and appointments
- **Doctor Model**: Handles doctor profiles, specializations, and availability

### Controllers
Controllers handle the business logic for various operations:
- **User Controller**: User registration, authentication, and appointment booking
- **Doctor Controller**: Doctor registration, profile management, and appointment handling

### Middleware
- **Auth Middleware**: Protects user routes and validates user tokens
- **Doctor Auth Middleware**: Secures doctor-specific endpoints

### API Routes

#### User Routes
| Method | Endpoint                   | Description                           | Auth Required |
|--------|----------------------------|---------------------------------------|--------------|
| POST   | /api/users/register        | Register a new user                   | No           |
| POST   | /api/users/login           | User login                            | No           |
| GET    | /api/users/profile         | Get user profile                      | Yes          |
| PUT    | /api/users/profile         | Update user profile                   | Yes          |
| POST   | /api/users/book-appointment | Book a new appointment                | Yes          |
| GET    | /api/users/appointments    | Get all user appointments             | Yes          |
| PUT    | /api/users/appointments/:id | Update an appointment                 | Yes          |
| DELETE | /api/users/appointments/:id | Cancel an appointment                 | Yes          |

#### Doctor Routes
| Method | Endpoint                      | Description                         | Auth Required |
|--------|-----------------------------|-----------------------------------|--------------|
| POST   | /api/doctors/register       | Register a new doctor               | No           |
| POST   | /api/doctors/login          | Doctor login                        | No           |
| GET    | /api/doctors/profile        | Get doctor profile                  | Yes (Doctor) |
| PUT    | /api/doctors/profile        | Update doctor profile               | Yes (Doctor) |
| PUT    | /api/doctors/availability   | Update availability schedule        | Yes (Doctor) |
| GET    | /api/doctors/appointments   | Get all appointments                | Yes (Doctor) |
| PUT    | /api/doctors/appointments/:id | Approve/reject appointment         | Yes (Doctor) |
| GET    | /api/doctors/specializations | Get all doctor specializations      | No           |

#### MRI Analysis
| Method | Endpoint               | Description                     | Auth Required |
|--------|------------------------|---------------------------------|--------------|
| POST   | /api/predict           | Analyze uploaded MRI scan       | No           |

#### Medical Chatbot
| Method | Endpoint               | Description                     | Auth Required |
|--------|------------------------|---------------------------------|--------------|
| POST   | /api/chat              | Send message to medical chatbot | No           |

## Frontend Integration
The frontend integrates with these APIs through several key components:

1. **Authentication Flow**:
   - Registration and login forms for users and doctors
   - Token-based authentication storage

2. **Appointment System**:
   - Appointment booking interface for patients
   - Doctor availability calendar
   - Appointment management dashboards

3. **MRI Analysis**:
   - MRI scan upload interface
   - Results display with confidence scores

4. **Hospital Locator**:
   - Interactive map showing nearby hospitals
   - Distance calculation and facility information

5. **Medical Chatbot**:
   - Chat interface for medical queries
   - AI-powered responses using medical knowledge

## Setup Instructions

### Backend
```bash
cd Backend
npm install
npm start
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in both the Backend and Frontend directories:

### Backend .env
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000
```

## Technologies Used
- **Frontend**: React, Tailwind CSS, Axios, Leaflet Maps
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI Components**: TensorFlow.js, Ollama 