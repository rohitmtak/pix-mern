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

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Navbar setToken={setToken} />
            <NotificationSystem />
            <NotificationTester />
            <WhatsAppManager />
            <main className="p-8">
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