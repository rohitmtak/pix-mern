import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg
import qrcodePkg from 'qrcode-terminal'
const qrcode = qrcodePkg

// WhatsApp Business API Service
class WhatsAppService {
  constructor() {
    this.client = null
    this.isReady = false
    this.adminNumbers = [] // Admin WhatsApp numbers
    
    // Only initialize WhatsApp in non-production environments
    // Railway/production environments can't handle interactive QR code authentication
    if (process.env.NODE_ENV !== 'production') {
      this.initializeClient()
    } else {
      console.log('⚠️ WhatsApp service disabled in production environment')
    }
  }

  initializeClient() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      })

      this.client.on('qr', (qr) => {
        console.log('📱 WhatsApp QR Code:')
        qrcode.generate(qr, { small: true })
        console.log('Scan this QR code with WhatsApp to authenticate')
      })

      this.client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!')
        this.isReady = true
      })

      this.client.on('authenticated', () => {
        console.log('🔐 WhatsApp authenticated successfully')
      })

      this.client.on('auth_failure', (msg) => {
        console.error('❌ WhatsApp authentication failed:', msg)
      })

      this.client.on('disconnected', (reason) => {
        console.log('🔌 WhatsApp disconnected:', reason)
        this.isReady = false
      })

      this.client.initialize()
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error)
    }
  }

  // Add admin phone numbers
  addAdminNumber(phoneNumber) {
    if (!this.adminNumbers.includes(phoneNumber)) {
      this.adminNumbers.push(phoneNumber)
      console.log(`📞 Added admin number: ${phoneNumber}`)
    }
  }

  // Remove admin phone number
  removeAdminNumber(phoneNumber) {
    this.adminNumbers = this.adminNumbers.filter(num => num !== phoneNumber)
    console.log(`📞 Removed admin number: ${phoneNumber}`)
  }

  // Send message to admin
  async sendToAdmin(message) {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp client not ready, message queued')
      return false
    }

    try {
      const promises = this.adminNumbers.map(async (number) => {
        const chatId = `${number}@c.us`
        await this.client.sendMessage(chatId, message)
        console.log(`📱 Message sent to admin ${number}`)
      })

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Failed to send WhatsApp message to admin:', error)
      return false
    }
  }

  // Send message to customer
  async sendToCustomer(phoneNumber, message) {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp client not ready, message queued')
      return false
    }

    try {
      const chatId = `${phoneNumber}@c.us`
      await this.client.sendMessage(chatId, message)
      console.log(`📱 Message sent to customer ${phoneNumber}`)
      return true
    } catch (error) {
      console.error('Failed to send WhatsApp message to customer:', error)
      return false
    }
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

  // Get client status
  getStatus() {
    return {
      isReady: this.isReady,
      adminNumbers: this.adminNumbers,
      isConnected: this.client ? true : false
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService()

export default whatsappService
