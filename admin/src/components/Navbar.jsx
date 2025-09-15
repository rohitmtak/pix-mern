import React from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'

const Navbar = ({setToken}) => {
  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear httpOnly cookie
      await axios.post(backendUrl + '/api/user/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local authentication state
      setToken('');
    }
  };

  return (
    <div className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        <div className='flex items-center space-x-4'>
          <img className='w-12 h-8 object-contain' src={assets.logo} alt="PIX Logo" />
          <div className='hidden md:block'>
            <h1 className='text-xl font-semibold text-gray-800'>Admin Panel</h1>
            <p className='text-sm text-gray-600'>Product & Order Management</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className='bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 rounded-lg flex items-center space-x-2'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar