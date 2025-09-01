import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const WhatsAppManager = () => {
  const [adminNumbers, setAdminNumbers] = useState([])
  const [newNumber, setNewNumber] = useState('')
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
      })
      
      if (response.data.success) {
        alert('Test message sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send test message:', error)
      alert('Failed to send test message')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 max-w-sm">
      <h3 className="font-medium text-gray-900 mb-3">📱 WhatsApp Manager</h3>
      
      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${whatsappStatus.isReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {whatsappStatus.isReady ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <button
          onClick={fetchWhatsAppStatus}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Refresh Status
        </button>
      </div>

      {/* Add Admin Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Admin Number
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="+91XXXXXXXXXX"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addAdminNumber}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Admin Numbers List */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Numbers ({whatsappStatus.adminNumbers?.length || 0})
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {whatsappStatus.adminNumbers?.map((number, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-700">{number}</span>
              <button
                onClick={() => removeAdminNumber(number)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          {(!whatsappStatus.adminNumbers || whatsappStatus.adminNumbers.length === 0) && (
            <div className="text-sm text-gray-500 text-center py-2">
              No admin numbers added
            </div>
          )}
        </div>
      </div>

      {/* Test Message */}
      <div className="mb-4">
        <button
          onClick={testWhatsAppMessage}
          disabled={!whatsappStatus.isReady}
          className={`w-full px-3 py-2 rounded-md text-sm ${
            whatsappStatus.isReady
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🧪 Send Test Message
        </button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600">
        <p className="mb-1">📋 Instructions:</p>
        <ul className="space-y-1">
          <li>• Scan QR code in backend console</li>
          <li>• Add admin phone numbers</li>
          <li>• Test notifications</li>
          <li>• Customers will receive updates</li>
        </ul>
      </div>
    </div>
  )
}

export default WhatsAppManager
