import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { setupAxiosInterceptors } from './utils/auth'

// Set up global axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
setupAxiosInterceptors(axios);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
