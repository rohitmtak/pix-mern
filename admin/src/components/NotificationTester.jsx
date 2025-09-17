import React, { useState, useRef } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const NotificationTester = ({ isMinimized, setIsMinimized, position, setPosition }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const testNotification = async (type) => {
    try {
      const response = await axios.post(`${backendUrl}/api/test/test-notification`, { type }, {
        withCredentials: true // Include httpOnly cookies for authentication
      })
      console.log('Test notification sent:', response.data)
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return // Don't drag if clicking on buttons
    
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
    const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 100)
    
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
            <h3 className="font-medium text-gray-900 text-xs">🧪 Test</h3>
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
        <div className="p-3 w-40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm">🧪 Test</h3>
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
          <div className="space-y-1">
            <button
              onClick={() => testNotification('new_order')}
              className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              🛍️ Order
            </button>
            <button
              onClick={() => testNotification('status_update')}
              className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              📦 Status
            </button>
            <button
              onClick={() => testNotification('low_stock')}
              className="w-full px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
            >
              ⚠️ Stock
            </button>
            <button
              onClick={() => testNotification('daily_summary')}
              className="w-full px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
            >
              📊 Summary
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationTester
