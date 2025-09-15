import express from 'express'
import {placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay} from '../controllers/orderController.js'
import { handleRazorpayWebhook } from '../utils/razorpayWebhook.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
// Legacy routes for backward compatibility
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// New RESTful routes (optional - for future use)
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.put('/:id/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// Webhook endpoint (no auth required - Razorpay calls this)
orderRouter.post('/webhook/razorpay', express.raw({type: 'application/json'}), handleRazorpayWebhook)

// User Feature 
// Legacy routes for backward compatibility
orderRouter.post('/userorders', authUser, userOrders)

// New RESTful routes (optional - for future use)
orderRouter.get('/user', authUser, userOrders)

// verify payment
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

export default orderRouter