import { io } from '../server.js'
import whatsappService from './whatsappService.js'

// Notification service for real-time admin notifications
class NotificationService {
  // Send new order notification to admin
  static async sendNewOrderNotification(orderData) {
    const notification = {
      type: 'new_order',
      title: '🛍️ New Order Received!',
      message: `Order #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'} - ₹${orderData.total || orderData.amount}`,
      orderId: orderData._id,
      customerName: orderData.shippingAddress?.fullName || orderData.customer?.firstName || 'Customer',
      amount: orderData.total || orderData.amount,
      timestamp: new Date().toISOString(),
      sound: true
    }

    // Emit to admin room (WebSocket)
    io.to('admin').emit('new_order', notification)
    
    // Send WhatsApp notification to admin
    await whatsappService.sendNewOrderNotification(orderData)
    
    console.log('📢 New order notification sent:', notification.message)
  }

  // Send order status update notification
  static async sendOrderStatusUpdate(orderId, oldStatus, newStatus) {
    const notification = {
      type: 'status_update',
      title: '📦 Order Status Updated',
      message: `Order #${(orderId?.toString() || '').slice(-8).toUpperCase()} changed from ${oldStatus} to ${newStatus}`,
      orderId: orderId,
      oldStatus: oldStatus,
      newStatus: newStatus,
      timestamp: new Date().toISOString(),
      sound: false
    }

    io.to('admin').emit('order_status_update', notification)
    
    // Send WhatsApp notification to admin
    await whatsappService.sendOrderStatusUpdate(orderId, oldStatus, newStatus)
    
    console.log('📢 Status update notification sent:', notification.message)
  }

  // Send low stock notification
  static async sendLowStockNotification(productName, currentStock) {
    const notification = {
      type: 'low_stock',
      title: '⚠️ Low Stock Alert',
      message: `${productName} is running low on stock (${currentStock} remaining)`,
      productName: productName,
      currentStock: currentStock,
      timestamp: new Date().toISOString(),
      sound: true
    }

    io.to('admin').emit('low_stock', notification)
    
    // Send WhatsApp notification to admin
    await whatsappService.sendLowStockAlert(productName, currentStock)
    
    console.log('📢 Low stock notification sent:', notification.message)
  }

  // Send daily summary
  static async sendDailySummary(summary) {
    const notification = {
      type: 'daily_summary',
      title: '📊 Daily Order Summary',
      message: `${summary.totalOrders} orders today • ₹${summary.totalRevenue} revenue`,
      summary: summary,
      timestamp: new Date().toISOString(),
      sound: false
    }

    io.to('admin').emit('daily_summary', notification)
    
    // Send WhatsApp notification to admin
    await whatsappService.sendDailySummary(summary)
    
    console.log('📢 Daily summary sent:', notification.message)
  }

  // Send shipping notification to customer
  static async sendShippingNotification(orderData, trackingNumber, courier) {
    const notification = {
      type: 'shipping',
      title: '🚚 Order Shipped!',
      message: `Order #${(orderData._id?.toString() || '').slice(-8).toUpperCase()} has been shipped via ${courier}`,
      orderId: orderData._id,
      trackingNumber: trackingNumber,
      courier: courier,
      timestamp: new Date().toISOString(),
      sound: true
    }

    io.to('admin').emit('shipping_notification', notification)
    
    // Send WhatsApp notification to customer
    await whatsappService.sendShippingNotification(orderData, trackingNumber, courier)
    
    console.log('📢 Shipping notification sent:', notification.message)
  }

  // Send order and payment confirmation to customer
  static async sendOrderAndPaymentConfirmation(orderData) {
    const notification = {
      type: 'order_payment_confirmation',
      title: '🎉 Order & Payment Confirmed!',
      message: `Order #${(orderData._id?.toString() || '').slice(-8).toUpperCase()} - ₹${orderData.total || orderData.amount}`,
      orderId: orderData._id,
      amount: orderData.total || orderData.amount,
      timestamp: new Date().toISOString(),
      sound: true
    }

    io.to('admin').emit('order_payment_confirmation', notification)
    
    // Send WhatsApp notification to customer
    await whatsappService.sendOrderAndPaymentConfirmation(orderData)
    
    console.log('📢 Order and payment confirmation sent:', notification.message)
  }
}

export default NotificationService
