import nodemailer from 'nodemailer'

// WhatsApp via Meta Cloud API (no Puppeteer) with Email fallback
class WhatsAppService {
  constructor() {
    this.isReady = false
    this.adminNumbers = []
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    this.baseUrl = this.phoneNumberId ? `https://graph.facebook.com/v18.0/${this.phoneNumberId}` : ''
    this.adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

    // Bootstrap admin numbers from env (comma-separated, e.g., 919999999999,918888888888)
    const envAdminNumbers = (process.env.ADMIN_NUMBERS || '')
      .split(',')
      .map(n => n.trim())
      .filter(Boolean)
    for (const n of envAdminNumbers) this.addAdminNumber(n)

    if (this.accessToken && this.phoneNumberId) {
      this.isReady = true
      console.log('✅ WhatsApp Meta API service initialized')
    } else {
      console.log('⚠️ WhatsApp Meta API not configured. Falling back to email notifications when possible.')
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

  // Internal: send plain email to admins (fallback)
  async sendAdminEmail(subject, html) {
    try {
      if (!this.adminEmails.length) return false
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return false

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
      })

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: this.adminEmails.join(','),
        subject,
        html
      })
      console.log('✉️ Admin fallback email sent:', info.messageId)
      return true
    } catch (err) {
      console.error('Failed to send admin fallback email:', err)
      return false
    }
  }

  async sendViaMeta(phoneNumber, message) {
    if (!this.isReady) return false
    try {
      const formatted = this.formatPhoneNumber(phoneNumber)
      const res = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formatted,
          type: 'text',
          text: { preview_url: false, body: message }
        })
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('❌ WhatsApp API error:', data)
        return false
      }
      return true
    } catch (err) {
      console.error('WhatsApp Meta send failed:', err)
      return false
    }
  }

  formatPhoneNumber(phone) {
    let cleaned = String(phone || '').replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1)
    if (!cleaned.startsWith('91') && cleaned.length === 10) cleaned = '91' + cleaned
    return cleaned
  }

  // Send message to admin
  async sendToAdmin(message) {
    try {
      const results = await Promise.all(this.adminNumbers.map((n) => this.sendViaMeta(n, message)))
      const success = results.some(Boolean)
      if (success) return true
      // Fallback email
      const subject = 'PIX Admin Alert'
      const html = `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap;">${message}</pre>`
      const emailSent = await this.sendAdminEmail(subject, html)
      return emailSent
    } catch (error) {
      console.error('Failed to send admin notification:', error)
      return false
    }
  }

  // Send message to customer
  async sendToCustomer(phoneNumber, message) {
    return await this.sendViaMeta(phoneNumber, message)
  }

  // New order notification to admin
  async sendNewOrderNotification(orderData) {
    const message = `🚨 *URGENT: NEW ORDER RECEIVED!* 🚨\n\n🛍️ *PIX Luxury Clothing*\n📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}\n💰 Amount: ₹${orderData.total || orderData.amount}\n👤 Customer: ${orderData.shippingAddress?.fullName || orderData.customer?.firstName || 'N/A'}\n📞 Phone: ${orderData.shippingAddress?.phone || orderData.customerPhone || 'N/A'}\n📅 Date: ${new Date().toLocaleString('en-IN')}\n\n📍 Shipping Address:\n${orderData.shippingAddress?.line1 || 'N/A'}\n${orderData.shippingAddress?.city || 'N/A'}, ${orderData.shippingAddress?.state || 'N/A'}\n\n🛒 Items: ${orderData.items?.length || 0} items\n\n⚠️ *ACTION REQUIRED: Process this order immediately!* ⚠️\n\n_Order is ready for processing!_`

    const sent = await this.sendToAdmin(message)
    return sent
  }

  // Order status update notification to admin
  async sendOrderStatusUpdate(orderId, oldStatus, newStatus) {
    const message = `📦 *ORDER STATUS UPDATED*\n\n🆔 Order ID: #${(orderId?.toString() || '').slice(-8).toUpperCase()}\n🔄 Status: ${oldStatus} → ${newStatus}\n⏰ Time: ${new Date().toLocaleString('en-IN')}\n\n_Status has been updated successfully!_`

    return await this.sendToAdmin(message)
  }

  // Consolidated order and payment confirmation to customer
  async sendOrderAndPaymentConfirmation(orderData) {
    const message = `🎉 *ORDER & PAYMENT CONFIRMED!*\n\nThank you for your order with PIX Luxury Clothing!\n\n📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}\n💰 Total Amount: ₹${orderData.total || orderData.amount}\n📅 Order Date: ${new Date().toLocaleString('en-IN')}\n\n🛒 Your Order:\n${orderData.items?.map(item => `• ${item.name} (${item.size}, ${item.color}) x${item.quantity}`).join('\n')}\n\n✅ Payment Status: Confirmed\n🔄 Order Status: Processing\n\n📞 Need help? Contact us at +91-XXXXXXXXXX\n🌐 Visit: www.highstreetpix.com\n\n_Your order is now being processed! We'll notify you when it ships._`

    const customerPhone = orderData.shippingAddress?.phone || orderData.customerPhone
    if (customerPhone) {
      const sent = await this.sendToCustomer(customerPhone, message)
      if (!sent && orderData.customerEmail) {
        try {
          if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
            })
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: orderData.customerEmail,
              subject: 'PIX - Order & Payment Confirmed',
              html: message.replace(/\n/g, '<br />')
            })
            console.log('✉️ Customer fallback email sent')
            return true
          }
        } catch (e) {
          console.error('Customer fallback email failed:', e)
        }
      }
    }
    return false
  }

  // Shipping notification to customer
  async sendShippingNotification(orderData, trackingNumber, courier) {
    const message = `🚚 *YOUR ORDER IS SHIPPED!*\n\n📦 Order ID: #${(orderData._id?.toString() || '').slice(-8).toUpperCase() || 'NEW'}\n🚛 Courier: ${courier}\n📋 Tracking: ${trackingNumber}\n📅 Shipped: ${new Date().toLocaleString('en-IN')}\n\n📍 Shipping to:\n${orderData.shippingAddress?.fullName || 'N/A'}\n${orderData.shippingAddress?.line1 || 'N/A'}\n${orderData.shippingAddress?.city || 'N/A'}, ${orderData.shippingAddress?.state || 'N/A'}\n\n📞 Questions? Contact us at +91-XXXXXXXXXX\n\n_Your luxury clothing is on its way!_`

    const customerPhone = orderData.shippingAddress?.phone || orderData.customerPhone
    if (customerPhone) {
      const sent = await this.sendToCustomer(customerPhone, message)
      if (!sent && orderData.customerEmail) {
        try {
          if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
            })
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: orderData.customerEmail,
              subject: 'PIX - Your Order Has Shipped',
              html: message.replace(/\n/g, '<br />')
            })
            console.log('✉️ Customer shipping fallback email sent')
            return true
          }
        } catch (e) {
          console.error('Customer shipping fallback email failed:', e)
        }
      }
    }
    return false
  }

  // Low stock alert to admin
  async sendLowStockAlert(productName, currentStock) {
    const message = `⚠️ *LOW STOCK ALERT!*\n\n🛍️ Product: ${productName}\n📦 Current Stock: ${currentStock} units\n⏰ Alert Time: ${new Date().toLocaleString('en-IN')}\n\n_Please restock this item soon!_`

    return await this.sendToAdmin(message)
  }

  // Daily summary to admin
  async sendDailySummary(summary) {
    const message = `📊 *DAILY ORDER SUMMARY*\n\n📅 Date: ${new Date().toLocaleDateString('en-IN')}\n🛍️ Total Orders: ${summary.totalOrders}\n💰 Total Revenue: ₹${summary.totalRevenue}\n📦 Orders Pending: ${summary.pendingOrders || 0}\n🚚 Orders Shipped: ${summary.shippedOrders || 0}\n\n📈 Performance:\n• Average Order Value: ₹${Math.round(summary.totalRevenue / summary.totalOrders)}\n• Conversion Rate: ${summary.conversionRate || 'N/A'}%\n\n_Great work today!_`

    return await this.sendToAdmin(message)
  }

  // Get client status
  getStatus() {
    return {
      isReady: this.isReady,
      adminNumbers: this.adminNumbers,
      isConnected: this.isReady,
      provider: 'meta_cloud_api'
    }
  }
}

// Create singleton instance 
const whatsappService = new WhatsAppService()

export default whatsappService
