# AI Healthcare Frontend

A modern React application for the AI Healthcare platform, providing a user-friendly interface for various healthcare services.

## Features

- 🏥 MRI Scan Analysis
- 🔍 Disease Prediction
- 💊 Medicine Recommendations
- 📍 Hospital Locator
- 📅 Appointment Booking
- 💬 Medical Chatbot
- 📱 Responsive Design
- 🎨 Modern UI/UX

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Heroicons
- Axios

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Services.jsx
│   │   ├── MRIAnalysis.jsx
│   │   ├── DiseasePrediction.jsx
│   │   ├── HospitalMap.jsx
│   │   └── Appointment.jsx
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── public/                # Static assets
└── index.html            # HTML template
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Environment Variables

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000
```

## Dependencies

```json
{
  "dependencies": {
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.