import express from 'express'
import NotificationService from '../utils/notificationService.js'
import orderModel from '../models/orderModel.js'
import whatsappService from '../utils/whatsappService.js'

const testRouter = express.Router()

// Test endpoint to trigger notifications
testRouter.post('/test-notification', async (req, res) => {
  const { type } = req.body
  
  try {
    switch (type) {
      case 'new_order':
        await NotificationService.sendNewOrderNotification({
          _id: 'test_order_' + Date.now(),
          total: 2500,
          shippingAddress: {
            fullName: 'Test Customer'
          }
        })
        break
        
      case 'status_update':
        await NotificationService.sendOrderStatusUpdate(
          'test_order_123',
          'Order Placed',
          'Shipped'
        )
        break
        
      case 'low_stock':
        await NotificationService.sendLowStockNotification(
          'Test Product',
          5
        )
        break
        
      case 'daily_summary':
        await NotificationService.sendDailySummary({
          totalOrders: 15,
          totalRevenue: 45000
        })
        break
        
      default:
        return res.json({
          success: false,
          message: 'Invalid notification type. Use: new_order, status_update, low_stock, daily_summary'
        })
    }
    
    res.json({
      success: true,
      message: `Test ${type} notification sent successfully!`
    })
    
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// Shipping notification endpoint
testRouter.post('/send-shipping-notification', async (req, res) => {
  const { orderId, trackingNumber, courier } = req.body
  
  try {
    const order = await orderModel.findById(orderId)
    if (!order) {
      return res.json({
        success: false,
        message: 'Order not found'
      })
    }
    
    await NotificationService.sendShippingNotification(order, trackingNumber, courier)
    
    res.json({
      success: true,
      message: 'Shipping notification sent successfully!'
    })
    
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// WhatsApp status endpoint
testRouter.get('/whatsapp-status', (req, res) => {
  try {
    const status = whatsappService.getStatus()
    res.json(status)
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// Add admin number endpoint
testRouter.post('/add-admin-number', (req, res) => {
  const { phoneNumber } = req.body
  
  try {
    whatsappService.addAdminNumber(phoneNumber)
    res.json({
      success: true,
      message: 'Admin number added successfully'
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// Remove admin number endpoint
testRouter.post('/remove-admin-number', (req, res) => {
  const { phoneNumber } = req.body
  
  try {
    whatsappService.removeAdminNumber(phoneNumber)
    res.json({
      success: true,
      message: 'Admin number removed successfully'
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// Test WhatsApp message endpoint
testRouter.post('/test-whatsapp-message', async (req, res) => {
  const { message } = req.body
  
  try {
    const urgentMessage = message || `🚨 *URGENT TEST NOTIFICATION* 🚨

🛍️ *PIX Luxury Clothing Admin Panel*
📱 This is a test notification to check phone alerts
⏰ Time: ${new Date().toLocaleString('en-IN')}
🔔 Please check if your phone woke up!

⚠️ *This is a test message - no action required* ⚠️

_Testing notification system..._`
    
    await whatsappService.sendToAdmin(urgentMessage)
    res.json({
      success: true,
      message: 'Test message sent successfully'
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

export default testRouter
