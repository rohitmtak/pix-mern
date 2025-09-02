import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const NotificationSystem = () => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('🟢 Connected to notification server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('🔴 Disconnected from notification server')
      setIsConnected(false)
    })

    // Listen for new order notifications
    newSocket.on('new_order', (notification) => {
      console.log('📢 New order received:', notification)
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10
      
      // Show toast notification without any icon
      toast.success(
        <div>
          <div className="font-bold">{cleanNotificationContent(notification.title)}</div>
          <div className="text-sm">{cleanNotificationContent(notification.message)}</div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: false
        }
      )

      // Play notification sound
      if (notification.sound) {
        playNotificationSound()
      }
    })

    // Listen for order status updates
    newSocket.on('order_status_update', (notification) => {
      console.log('📦 Status update received:', notification)
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)])
      
      toast.info(
        <div>
          <div className="font-bold">{cleanNotificationContent(notification.title)}</div>
          <div className="text-sm">{cleanNotificationContent(notification.message)}</div>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: false
        }
      )
    })

    // Listen for low stock alerts
    newSocket.on('low_stock', (notification) => {
      console.log('⚠️ Low stock alert:', notification)
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)])
      
      toast.warning(
        <div>
          <div className="font-bold">{cleanNotificationContent(notification.title)}</div>
          <div className="text-sm">{cleanNotificationContent(notification.message)}</div>
        </div>,
        {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: false
        }
      )

      if (notification.sound) {
        playNotificationSound()
      }
    })

    // Listen for daily summaries
    newSocket.on('daily_summary', (notification) => {
      console.log('📊 Daily summary received:', notification)
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)])
      
      toast.info(
        <div>
          <div className="font-bold">{cleanNotificationContent(notification.title)}</div>
          <div className="text-sm">{cleanNotificationContent(notification.message)}</div>
        </div>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: false
        }
      )
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.log('Could not play notification sound:', error)
    }
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return '🛍️'
      case 'status_update':
        return '📦'
      case 'low_stock':
        return '⚠️'
      case 'daily_summary':
        return '📊'
      default:
        return '📢'
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Clean notification content to remove duplicate icons
  const cleanNotificationContent = (content) => {
    if (!content) return content
    // Remove common emoji icons that might be duplicated
    return content
      .replace(/[🛍️📦⚠️📊📢]/g, '') // Remove emoji icons
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Connection Status */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>

          {/* Notification Bell and Panel */}
          <div className="flex items-center space-x-4">
            {notifications.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </div>
                </button>
                
                {/* Notifications Panel - Positioned to avoid toast overlap */}
                {showPanel && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg border border-gray-200 shadow-lg w-80 z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 text-sm">Notifications</h3>
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification, index) => (
                        <div key={index} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-start gap-2">
                            <span className="text-sm flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs text-gray-900 truncate">
                                {cleanNotificationContent(notification.title)}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {cleanNotificationContent(notification.message)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSystem
