import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import StockManager from './components/StockManager'
import Login from './components/Login'
import NotificationSystem from './components/NotificationSystem'
import NotificationTester from './components/NotificationTester'
import WhatsAppManager from './components/WhatsAppManager'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Backend URL configuration with fallback
// Note: Vite automatically loads:
//   - .env for local development
//   - .env.production when building for production (npm run build)
// Environment variables must be prefixed with VITE_ to be exposed to the client
// 
// Priority: 1. VITE_BACKEND_URL from .env/.env.production, 2. Production default, 3. Development default
const getBackendUrl = () => {
  // Check for explicit environment variable first (from .env or .env.production)
  if (import.meta.env.VITE_BACKEND_URL) {
    const url = import.meta.env.VITE_BACKEND_URL;
    // In production, ensure HTTPS to avoid mixed content errors
    if (import.meta.env.PROD && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
  
  // Check if we're in production mode
  if (import.meta.env.PROD) {
    // Default production backend URL - update this to your actual backend URL
    // Example: https://13.204.195.106:4000 or https://api.highstreetpix.com
    // Better: Set VITE_BACKEND_URL in .env.production file
    console.warn('⚠️ VITE_BACKEND_URL not set in .env.production. Please set it in your environment variables.');
    return 'https://13.204.195.106:4000';  // Default production backend URL
  }
  
  // Default to development (uses Vite proxy /api -> http://localhost:3000)
  return 'http://localhost:3000';
};

export const backendUrl = getBackendUrl();

// Log backend URL for debugging (helps verify the correct URL is being used)
console.log('🔧 Backend URL:', backendUrl);
console.log('🔧 VITE_BACKEND_URL env:', import.meta.env.VITE_BACKEND_URL);
console.log('🔧 PROD mode:', import.meta.env.PROD);

export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('adminAuthenticated') === 'true' ? 'authenticated' : '');
  const [whatsappMinimized, setWhatsappMinimized] = useState(true)
  const [notificationMinimized, setNotificationMinimized] = useState(true)
  
  // Draggable positions
  const [whatsappPosition, setWhatsappPosition] = useState({ x: 20, y: 80 })
  const [notificationPosition, setNotificationPosition] = useState({ x: 20, y: 400 })

  useEffect(()=>{
    if (token === 'authenticated') {
      localStorage.setItem('adminAuthenticated', 'true')
    } else {
      localStorage.removeItem('adminAuthenticated')
    }
  },[token])

  // Auto-refresh token every 20 hours (before 24h expiration)
  useEffect(() => {
    if (token === 'authenticated') {
      const refreshInterval = setInterval(async () => {
        try {
          await axios.post(backendUrl + '/api/user/refresh-token', {}, {
            withCredentials: true
          });
          console.log('🔄 Admin token refreshed automatically');
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, logout the user
          setToken('');
        }
      }, 20 * 60 * 60 * 1000); // 20 hours

      return () => clearInterval(refreshInterval);
    }
  }, [token]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex">
          <Sidebar 
            whatsappMinimized={whatsappMinimized}
            setWhatsappMinimized={setWhatsappMinimized}
            notificationMinimized={notificationMinimized}
            setNotificationMinimized={setNotificationMinimized}
            whatsappPosition={whatsappPosition}
            setWhatsappPosition={setWhatsappPosition}
            notificationPosition={notificationPosition}
            setNotificationPosition={setNotificationPosition}
          />
          <div className="flex-1 relative">
            <Navbar setToken={setToken} />
            <NotificationSystem />
            
            {/* Only show expanded cards in main content area */}
            {!whatsappMinimized && (
              <div 
                className="fixed z-50 cursor-move"
                style={{ 
                  left: `${whatsappPosition.x}px`, 
                  top: `${whatsappPosition.y}px` 
                }}
              >
                <WhatsAppManager 
                  isMinimized={whatsappMinimized}
                  setIsMinimized={setWhatsappMinimized}
                  position={whatsappPosition}
                  setPosition={setWhatsappPosition}
                />
              </div>
            )}
            
            {!notificationMinimized && (
              <div 
                className="fixed z-50 cursor-move"
                style={{ 
                  left: `${notificationPosition.x}px`, 
                  top: `${notificationPosition.y}px` 
                }}
              >
                <NotificationTester 
                  isMinimized={notificationMinimized}
                  setIsMinimized={setNotificationMinimized}
                  position={notificationPosition}
                  setPosition={setNotificationPosition}
                />
              </div>
            )}
            
            <main className="p-8 bg-[#f1f2f2]">
              <Routes>
                <Route path='/' element={<Add token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/stock' element={<StockManager token={token} />} />
                <Route path='/settings' element={<Settings setToken={setToken} />} />
                <Route path='*' element={<Add token={token} />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

export default App