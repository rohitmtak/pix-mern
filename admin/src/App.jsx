import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import StockManager from './components/StockManager'
import Login from './components/Login'
import NotificationSystem from './components/NotificationSystem'
import NotificationTester from './components/NotificationTester'
import WhatsAppManager from './components/WhatsAppManager'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  const [whatsappMinimized, setWhatsappMinimized] = useState(false)
  const [notificationMinimized, setNotificationMinimized] = useState(false)
  
  // Draggable positions
  const [whatsappPosition, setWhatsappPosition] = useState({ x: 20, y: 80 })
  const [notificationPosition, setNotificationPosition] = useState({ x: 20, y: 400 })

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

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