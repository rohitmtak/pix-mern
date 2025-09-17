import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const WhatsAppManager = ({ isMinimized, setIsMinimized, position, setPosition }) => {
  const [adminNumbers, setAdminNumbers] = useState([])
  const [newNumber, setNewNumber] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  const [whatsappStatus, setWhatsappStatus] = useState({
    isReady: false,
    isConnected: false,
    adminNumbers: []
  })

  useEffect(() => {
    fetchWhatsAppStatus()
  }, [])

  const fetchWhatsAppStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/test/whatsapp-status`)
      setWhatsappStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch WhatsApp status:', error)
    }
  }

  const addAdminNumber = async () => {
    if (!newNumber || newNumber.length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/test/add-admin-number`, {
        phoneNumber: newNumber
      }, {
        withCredentials: true // Include httpOnly cookies for authentication
      })
      
      if (response.data.success) {
        setAdminNumbers([...adminNumbers, newNumber])
        setNewNumber('')
        fetchWhatsAppStatus()
        alert('Admin number added successfully!')
      }
    } catch (error) {
      console.error('Failed to add admin number:', error)
      alert('Failed to add admin number')
    }
  }

  const removeAdminNumber = async (number) => {
    try {
      const response = await axios.post(`${backendUrl}/api/test/remove-admin-number`, {
        phoneNumber: number
      }, {
        withCredentials: true // Include httpOnly cookies for authentication
      })
      
      if (response.data.success) {
        setAdminNumbers(adminNumbers.filter(n => n !== number))
        fetchWhatsAppStatus()
        alert('Admin number removed successfully!')
      }
    } catch (error) {
      console.error('Failed to remove admin number:', error)
      alert('Failed to remove admin number')
    }
  }

  const testWhatsAppMessage = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/test/test-whatsapp-message`, {
        message: '🧪 Test message from PIX Luxury Clothing Admin Panel!'
      }, {
        withCredentials: true // Include httpOnly cookies for authentication
      })
      
      if (response.data.success) {
        alert('Test message sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send test message:', error)
      alert('Failed to send test message')
    }
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return // Don't drag if clicking on buttons or inputs
    
    setIsDragging(true)
    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - (cardRef.current?.offsetWidth || 200)
    const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 150)
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg shadow-lg border border-gray-200 w-fit select-none ${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
      onMouseDown={handleMouseDown}
    >
      {isMinimized ? (
        <div className="p-2 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-gray-900 text-xs">📱 WhatsApp</h3>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-white border border-gray-200 transition-colors"
              title="Expand"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 w-64">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm">📱 WhatsApp</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 border border-gray-200 transition-colors"
              title="Minimize"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          {/* Status */}
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <div className={`w-2 h-2 rounded-full ${whatsappStatus.isReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs">
                {whatsappStatus.isReady ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={fetchWhatsAppStatus}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Refresh
            </button>
          </div>

          {/* Add Admin Number */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Add Number
            </label>
            <div className="flex gap-1">
              <input
                type="tel"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addAdminNumber}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Admin Numbers */}
          <div className="mb-3">
            <div className="text-xs text-gray-700 mb-1">
              Numbers: {whatsappStatus.adminNumbers?.length || 0}
            </div>
            <div className="max-h-16 overflow-y-auto space-y-1">
              {whatsappStatus.adminNumbers?.map((number, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                  <span className="text-gray-700 truncate flex-1 mr-1">{number}</span>
                  <button
                    onClick={() => removeAdminNumber(number)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Message */}
          <div className="mb-3">
            <button
              onClick={testWhatsAppMessage}
              disabled={!whatsappStatus.isReady}
              className={`w-full px-2 py-1 rounded text-xs ${
                whatsappStatus.isReady
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🧪 Test Message
            </button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-600 border-t pt-2">
            <p className="mb-1 font-medium">📋 Instructions:</p>
            <ul className="space-y-0.5 text-xs">
              <li>• Scan QR code in backend console</li>
              <li>• Add admin phone numbers</li>
              <li>• Test notifications</li>
              <li>• Customers will receive updates</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppManager
