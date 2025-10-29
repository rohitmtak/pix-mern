/**
 * WhatsApp Service using Meta Cloud API (REST-based, no Puppeteer)
 * 
 * This is a lightweight replacement for whatsapp-web.js that uses
 * the official Meta WhatsApp Cloud API instead of browser automation.
 * 
 * RAM Usage: <10MB (vs 500MB-1GB with Puppeteer)
 * Cost: FREE for <1,000 conversations/month
 */

// Using built-in fetch (Node 18+) - no import needed
// For Node 16, install: npm install node-fetch@2

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}`
    this.isReady = !!this.accessToken && !!this.phoneNumberId
    this.adminNumbers = []
    
    if (!this.isReady) {
      console.log('⚠️ WhatsApp Meta API not configured (missing access token or phone number ID)')
    } else {
      console.log('✅ WhatsApp Meta API service initialized')
    }
  }

  // Add admin phone number (format: 911234567890)
  addAdminNumber(phoneNumber) {
    const cleanedNumber = this.formatPhoneNumber(phoneNumber)
    if (!this.adminNumbers.includes(cleanedNumber)) {
      this.adminNumbers.push(cleanedNumber)
      console.log(`📞 Added admin number: ${cleanedNumber}`)
    }
  }

  // Remove admin phone number
  removeAdminNumber(phoneNumber) {
    const cleanedNumber = this.formatPhoneNumber(phoneNumber)
    this.adminNumbers = this.adminNumbers.filter(num => num !== cleanedNumber)
    console.log(`📞 Removed admin number: ${cleanedNumber}`)
  }

  // Format phone number for WhatsApp API (needs country code, no + sign)
  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '')
    
    // If starts with 0, remove it (local format)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    
    // If doesn't start with country code, assume India (91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned
    }
    
    return cleaned
  }

  // Send message using Meta Cloud API
  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp Meta API not ready')
      return false
    }

    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      const url = `${this.baseUrl}/messages`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedNumber,
          type: 'text',
          text: {
            preview_url: false, // Set to true if you want link previews
            body: message
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ WhatsApp message sent to ${formattedNumber}`)
        return true
      } else {
        console.error('❌ WhatsApp API error:', data)
        return false
      }
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error)
      return false
    }
  }

  // Send template message (for approved templates)
  async sendTemplateMessage(phoneNumber, templateName, templateParams = []) {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp Meta API not ready')
      return false
    }

    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      const url = `${this.baseUrl}/messages`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'en_US' // or 'en_IN' for India
            },
            components: templateParams.length > 0 ? [{
              type: 'body',
              parameters: templateParams.map(param => ({
                type: 'text',
                text: param
              }))
            }] : []
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ WhatsApp template message sent to ${formattedNumber}`)
        return true
      } else {
        console.error('❌ WhatsApp template API error:', data)
        return false
      }
    } catch (error) {
      console.error('Failed to send WhatsApp template message:', error)
      return false
    }
  }

  // Send message to admin (same API as before)
  async sendToAdmin(message) {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp client not ready')
      return false
    }

    try {
      const promises = this.adminNumbers.map(async (number) => {
        return await this.sendMessage(number, message)
      })

      const results = await Promise.all(promises)
      return results.every(r => r === true)
    } catch (error) {
      console.error('Failed to send WhatsApp message to admin:', error)
      return false
    }
  }

  // Send message to customer (same API as before)
  async sendToCustomer(phoneNumber, message) {
    return await this.sendMessage(phoneNumber, message)
  }

  // New order notification to admin
  async sendNewOrderNotification(orderData) {
    const message = `🚨 *URGENT: NEW ORDER RECEIVED!* 🚨

🛍️ *PIX Luxury Clothing*
📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}
💰 Amount: ₹${orderData.total || orderData.amount}
👤 Customer: ${orderData.shippingAddress?.fullName || orderData.customer?.firstName || 'N/A'}
📞 Phone: ${orderData.shippingAddress?.phone || orderData.customerPhone || 'N/A'}
📅 Date: ${new Date().toLocaleString('en-IN')}

📍 Shipping Address:
${orderData.shippingAddress?.line1 || 'N/A'}
${orderData.shippingAddress?.city || 'N/A'}, ${orderData.shippingAddress?.state || 'N/A'}

🛒 Items: ${orderData.items?.length || 0} items

⚠️ *ACTION REQUIRED: Process this order immediately!* ⚠️

_Order is ready for processing!_`

    return await this.sendToAdmin(message)
  }

  // Order status update notification to admin
  async sendOrderStatusUpdate(orderId, oldStatus, newStatus) {
    const message = `📦 *ORDER STATUS UPDATED*

🆔 Order ID: #${(orderId?.toString() || '').slice(-8).toUpperCase()}
🔄 Status: ${oldStatus} → ${newStatus}
⏰ Time: ${new Date().toLocaleString('en-IN')}

_Status has been updated successfully!_`

    return await this.sendToAdmin(message)
  }

  // Consolidated order and payment confirmation to customer
  async sendOrderAndPaymentConfirmation(orderData) {
    const message = `🎉 *ORDER & PAYMENT CONFIRMED!*

Thank you for your order with PIX Luxury Clothing!

📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}
💰 Total Amount: ₹${orderData.total || orderData.amount}
📅 Order Date: ${new Date().toLocaleString('en-IN')}

🛒 Your Order:
${orderData.items?.map(item => `• ${item.name} (${item.size}, ${item.color}) x${item.quantity}`).join('\n')}

✅ Payment Status: Confirmed
🔄 Order Status: Processing

📞 Need help? Contact us at +91-XXXXXXXXXX
🌐 Visit: www.highstreetpix.com

_Your order is now being processed! We'll notify you when it ships._`

    const customerPhone = orderData.shippingAddress?.phone || orderData.customerPhone
    if (customerPhone) {
      return await this.sendToCustomer(customerPhone, message)
    }
    return false
  }

  // Shipping notification to customer
  async sendShippingNotification(orderData, trackingNumber, courier) {
    const message = `🚚 *YOUR ORDER IS SHIPPED!*

📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}
🚛 Courier: ${courier}
📋 Tracking: ${trackingNumber}
📅 Shipped: ${new Date().toLocaleString('en-IN')}

📍 Shipping to:
${orderData.shippingAddress?.fullName || 'N/A'}
${orderData.shippingAddress?.line1 || 'N/A'}
${orderData.shippingAddress?.city || 'N/A'}, ${orderData.shippingAddress?.state || 'N/A'}

📞 Questions? Contact us at +91-XXXXXXXXXX

_Your luxury clothing is on its way!_`

    const customerPhone = orderData.shippingAddress?.phone || orderData.customerPhone
    if (customerPhone) {
      return await this.sendToCustomer(customerPhone, message)
    }
    return false
  }

  // Low stock alert to admin
  async sendLowStockAlert(productName, currentStock) {
    const message = `⚠️ *LOW STOCK ALERT!*

🛍️ Product: ${productName}
📦 Current Stock: ${currentStock} units
⏰ Alert Time: ${new Date().toLocaleString('en-IN')}

_Please restock this item soon!_`

    return await this.sendToAdmin(message)
  }

  // Daily summary to admin
  async sendDailySummary(summary) {
    const message = `📊 *DAILY ORDER SUMMARY*

📅 Date: ${new Date().toLocaleDateString('en-IN')}
🛍️ Total Orders: ${summary.totalOrders}
💰 Total Revenue: ₹${summary.totalRevenue}
📦 Orders Pending: ${summary.pendingOrders || 0}
🚚 Orders Shipped: ${summary.shippedOrders || 0}

📈 Performance:
• Average Order Value: ₹${Math.round(summary.totalRevenue / summary.totalOrders)}
• Conversion Rate: ${summary.conversionRate || 'N/A'}%

_Great work today!_`

    return await this.sendToAdmin(message)
  }

  // Get service status
  getStatus() {
    return {
      isReady: this.isReady,
      adminNumbers: this.adminNumbers,
      provider: 'meta_cloud_api',
      isConnected: this.isReady
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService()

export default whatsappService
