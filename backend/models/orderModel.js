import mongoose from 'mongoose'

// Define structured schemas for better validation
const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    color: { type: String },
    image: { type: String }
}, { _id: false })

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "IN" }
}, { _id: false })

const paymentDetailsSchema = new mongoose.Schema({
    method: { type: String, enum: ['card', 'netbanking', 'upi'], required: true },
    gateway: { type: String, enum: ['razorpay'], required: true },
    transactionId: { type: String },
    gatewayOrderId: { type: String }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    // User reference
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    
    // Customer information
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    
    // Order details
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    
    // Addresses
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    
    // Payment
    paymentDetails: paymentDetailsSchema,
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'], 
        default: 'pending' 
    },
    
    // Order status
    status: { 
        type: String, 
        enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
        default: 'placed' 
    },
    
    // Timestamps
    orderDate: { type: Date, default: Date.now },
    paymentDate: { type: Date },
    shippedDate: { type: Date },
    deliveredDate: { type: Date },
    
    // Additional info
    notes: { type: String },
    trackingNumber: { type: String },
    
    // Legacy fields for backward compatibility
    amount: { type: Number }, // Keep for existing code
    address: { type: Object }, // Keep for existing code
    paymentMethod: { type: String }, // Keep for existing code
    payment: { type: Boolean, default: false }, // Keep for existing code
    date: { type: Number } // Keep for existing code
}, { 
    timestamps: true, // Adds createdAt and updatedAt automatically
    minimize: false 
})

// Indexes for better query performance
orderSchema.index({ userId: 1, orderDate: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentStatus: 1 })

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;