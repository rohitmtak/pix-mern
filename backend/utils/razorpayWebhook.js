// Razorpay webhook signature verification
import crypto from 'crypto';
import orderModel from '../models/orderModel.js';

export const verifyWebhookSignature = (body, signature, secret) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

// Webhook handler for payment events
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body; // Already parsed as raw JSON
    
    // Verify webhook signature
    if (!verifyWebhookSignature(JSON.stringify(body), signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
      console.log('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = body;
    console.log('Received webhook event:', event.event);
    
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const handlePaymentCaptured = async (payment) => {
  try {
    console.log('Processing payment captured:', payment.id);
    
    // Update order status based on webhook
    const order = await orderModel.findOne({ 
      'paymentDetails.gatewayOrderId': payment.order_id 
    });
    
    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentDate = new Date();
      order.status = 'confirmed';
      await order.save();
      console.log('Order updated to paid:', order._id);
    } else {
      console.log('Order not found or already paid:', payment.order_id);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    console.log('Processing payment failed:', payment.id);
    
    // Handle failed payment
    const order = await orderModel.findOne({ 
      'paymentDetails.gatewayOrderId': payment.order_id 
    });
    
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      console.log('Order updated to failed:', order._id);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

const handleOrderPaid = async (order) => {
  try {
    console.log('Processing order paid:', order.id);
    
    // Handle order paid event
    const dbOrder = await orderModel.findOne({ 
      'paymentDetails.gatewayOrderId': order.id 
    });
    
    if (dbOrder && dbOrder.paymentStatus !== 'paid') {
      dbOrder.paymentStatus = 'paid';
      dbOrder.paymentDate = new Date();
      dbOrder.status = 'confirmed';
      await dbOrder.save();
      console.log('Order updated to paid via order.paid event:', dbOrder._id);
    }
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
};
