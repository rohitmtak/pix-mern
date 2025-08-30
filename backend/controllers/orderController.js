import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'

// global variables
const currency = 'inr'

// gateway initialize
const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { items, amount, address, customerEmail, customerPhone, paymentMethod } = req.body
        const { userId } = req.user; // Get userId from auth middleware

        console.log('Received order request:');
        console.log('userId:', userId);
        console.log('items:', items);
        console.log('amount:', amount);
        console.log('address:', address);
        console.log('customerEmail:', customerEmail);
        console.log('customerPhone:', customerPhone);
        console.log('paymentMethod:', paymentMethod);

        // Validate required fields
        if (!userId || !items || !amount || !address) {
            console.log('Validation failed:');
            console.log('userId exists:', !!userId);
            console.log('items exists:', !!items);
            console.log('amount exists:', !!amount);
            console.log('address exists:', !!address);
            
            return res.json({ 
                success: false, 
                message: 'Missing required fields',
                details: {
                    userId: !!userId,
                    items: !!items,
                    amount: !!amount,
                    address: !!address
                }
            })
        }

        // Additional validation for items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.json({
                success: false,
                message: 'Items array is empty or invalid'
            })
        }

        // Validate each item has required fields
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.productId || !item.name || !item.price || !item.quantity || !item.size || !item.color) {
                return res.json({
                    success: false,
                    message: `Item ${i + 1} is missing required fields`,
                    item: item
                })
            }
        }

        // Calculate totals properly
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = 0 // Free shipping
        const total = subtotal + shipping

        console.log('Calculated totals:');
        console.log('subtotal:', subtotal);
        console.log('shipping:', shipping);
        console.log('total:', total);

        // Prepare order data with both new and legacy structure
        const orderData = {
            // New structured fields
            userId,
            customerEmail: customerEmail || address.phone, // Fallback to phone if email not provided
            customerPhone: customerPhone || address.phone,
            items,
            subtotal,
            shipping,
            total,
            shippingAddress: address,
            billingAddress: address, // Default to same as shipping
            paymentDetails: {
                method: paymentMethod || 'card',
                gateway: 'razorpay'
            },
            paymentStatus: 'pending',
            status: 'placed',
            orderDate: new Date(),
            
            // Legacy fields for backward compatibility
            amount: total,
            address: address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: total * 100, // Use calculated total
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
            notes: {
                orderId: newOrder._id.toString(),
                customerEmail: orderData.customerEmail
            }
        }

        await razorpayInstance.orders.create(options, (error, razorpayOrder) => {
            if (error) {
                console.log('Razorpay error:', error)
                return res.json({success:false, message: error})
            }
            
            // Update order with Razorpay order ID
            orderModel.findByIdAndUpdate(
                newOrder._id, 
                { 'paymentDetails.gatewayOrderId': razorpayOrder.id }
            ).exec()
            
            res.json({
                success: true, 
                order: razorpayOrder,
                orderId: newOrder._id
            })
        })

    } catch (error) {
        console.log('Order creation error:', error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { razorpay_order_id, razorpay_payment_id } = req.body
        const { userId } = req.user; // Get userId from auth middleware

        // Fetch order from Razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if (orderInfo.status === 'paid') {
            // Update order with both new and legacy fields
            const updatedOrder = await orderModel.findOneAndUpdate(
                { 'paymentDetails.gatewayOrderId': razorpay_order_id },
                { 
                    // New structured fields
                    paymentStatus: 'paid',
                    paymentDate: new Date(),
                    'paymentDetails.transactionId': razorpay_payment_id,
                    status: 'confirmed',
                    
                    // Legacy fields for backward compatibility
                    payment: true
                },
                { new: true }
            )

            if (updatedOrder) {
                // Clear user's cart
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                
                res.json({ 
                    success: true, 
                    message: "Payment Successful",
                    orderId: updatedOrder._id
                })
            } else {
                // Fallback to legacy method if new method fails
                await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                res.json({ success: true, message: "Payment Successful" })
            }
        } else {
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log('Payment verification error:', error)
        res.json({success:false,message:error.message})
    }
}

// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Frontend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.user; // Get userId from auth middleware

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyRazorpay, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus}