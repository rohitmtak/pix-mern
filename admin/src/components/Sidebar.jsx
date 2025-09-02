import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import WhatsAppManager from './WhatsAppManager'
import NotificationTester from './NotificationTester'

const Sidebar = ({ 
  whatsappMinimized, 
  setWhatsappMinimized, 
  notificationMinimized, 
  setNotificationMinimized,
  whatsappPosition,
  setWhatsappPosition,
  notificationPosition,
  setNotificationPosition
}) => {
  return (
    <div className='w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col'>
      <style>
        {`
          .bg-black img {
            filter: brightness(0) invert(1);
          }
        `}
      </style>
      
      {/* Main navigation content */}
      <div className='p-6 flex-1'>
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-800 mb-1'>Navigation</h2>
          <p className='text-sm text-gray-600'>Manage your store</p>
        </div>
        
        <nav className='space-y-2'>
          <NavLink 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            } 
            to="/add"
          >
            <img className='w-5 h-5' src={assets.add_icon} alt="" />
            <span className='font-medium'>Add Products</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            } 
            to="/list"
          >
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <span className='font-medium'>Product List</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            } 
            to="/orders"
          >
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <span className='font-medium'>Orders</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            } 
            to="/stock"
          >
            <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className='font-medium'>Stock Management</span>
          </NavLink>
        </nav>
        
        {/* Minimized cards below navigation */}
        <div className='mt-8 space-y-2'>
          {whatsappMinimized && (
            <WhatsAppManager 
              isMinimized={whatsappMinimized}
              setIsMinimized={setWhatsappMinimized}
              position={whatsappPosition}
              setPosition={setWhatsappPosition}
            />
          )}
          {notificationMinimized && (
            <NotificationTester 
              isMinimized={notificationMinimized}
              setIsMinimized={setNotificationMinimized}
              position={notificationPosition}
              setPosition={setNotificationPosition}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar