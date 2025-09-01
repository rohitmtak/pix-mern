import React from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const NotificationTester = () => {
  const testNotification = async (type) => {
    try {
      const response = await axios.post(`${backendUrl}/api/test/test-notification`, { type })
      console.log('Test notification sent:', response.data)
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <h3 className="font-medium text-gray-900 mb-3">🧪 Test Notifications</h3>
      <div className="space-y-2">
        <button
          onClick={() => testNotification('new_order')}
          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          🛍️ New Order
        </button>
        <button
          onClick={() => testNotification('status_update')}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          📦 Status Update
        </button>
        <button
          onClick={() => testNotification('low_stock')}
          className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
        >
          ⚠️ Low Stock
        </button>
        <button
          onClick={() => testNotification('daily_summary')}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
        >
          📊 Daily Summary
        </button>
      </div>
    </div>
  )
}

export default NotificationTester
