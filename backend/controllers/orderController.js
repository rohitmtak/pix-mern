import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import razorpay from 'razorpay'
import NotificationService from '../utils/notificationService.js'

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isTestMode = process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_');

console.log(`🚀 Server running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
console.log(`💳 Razorpay ${isTestMode ? 'TEST' : 'LIVE'} mode`);

// global variables
const currency = 'inr'

// Function to validate stock availability
const validateStockAvailability = async (items) => {
    try {
        const outOfStockItems = [];
        
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return {
                    success: false,
                    message: `Product ${item.name} not found`
                };
            }

            const colorVariant = product.colorVariants.find(
                variant => variant.color.toLowerCase() === item.color.toLowerCase()
            );

            if (!colorVariant) {
                return {
                    success: false,
                    message: `Color variant ${item.color} not found for ${item.name}`
                };
            }

            if (!colorVariant.sizes.includes(item.size)) {
                return {
                    success: false,
                    message: `Size ${item.size} not available for ${item.name} in ${item.color}`
                };
            }

            if (colorVariant.stock < item.quantity) {
                outOfStockItems.push({
                    productId: item.productId,
                    name: item.name,
                    color: item.color,
                    size: item.size,
                    requestedQuantity: item.quantity,
                    availableStock: colorVariant.stock
                });
            }
        }

        if (outOfStockItems.length > 0) {
            return {
                success: false,
                message: 'Some items are out of stock or have insufficient quantity',
                outOfStockItems
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Stock validation error:', error);
        return {
            success: false,
            message: 'Error validating stock availability'
        };
    }
};

// Function to reduce stock after successful order
const reduceStock = async (items) => {
    try {
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (product) {
                const colorVariant = product.colorVariants.find(
                    variant => variant.color.toLowerCase() === item.color.toLowerCase()
                );
                
                if (colorVariant) {
                    colorVariant.stock -= item.quantity;
                    await product.save();
                }
            }
        }
    } catch (error) {
        console.error('Stock reduction error:', error);
        throw error;
    }
};

// gateway initialize
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Razorpay keys are missing from environment variables');
    console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
}

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})




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

        // Validate stock availability before processing order
        const stockValidation = await validateStockAvailability(items);
        if (!stockValidation.success) {
            return res.json({
                success: false,
                message: stockValidation.message,
                outOfStockItems: stockValidation.outOfStockItems
            });
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

        // Validate amount limits for Razorpay (environment-aware)
        const maxAmount = process.env.RAZORPAY_MAX_AMOUNT ? parseInt(process.env.RAZORPAY_MAX_AMOUNT) : (isTestMode ? 100000 : 1000000); // ₹1 lakh test, ₹10 lakhs production
        if (total > maxAmount) {
            const suggestedParts = Math.ceil(total / maxAmount);
            return res.json({
                success: false,
                message: `Order amount ${total.toLocaleString('en-IN')} exceeds the maximum allowed amount of ${maxAmount.toLocaleString('en-IN')}. Please split your order into ${suggestedParts} parts or contact support.`,
                suggestedParts: suggestedParts,
                maxAmount: maxAmount
            });
        }

        // Validate minimum amount
        const minAmount = process.env.RAZORPAY_MIN_AMOUNT ? parseInt(process.env.RAZORPAY_MIN_AMOUNT) : 1; // ₹1 minimum
        if (total < minAmount) {
            return res.json({
                success: false,
                message: `Order amount ₹${total} is below the minimum required amount of ₹${minAmount}.`
            });
        }

        console.log('Amount validation passed:');
        console.log('Total amount:', total);
        console.log('Max allowed:', maxAmount);
        console.log('Min required:', minAmount);
        console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

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
            status: 'pending',
            orderDate: new Date(),
            
            // Legacy fields for backward compatibility
            amount: total,
            address: address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        // Don't save yet - wait for payment confirmation

        const options = {
            amount: total * 100, // Use calculated total
            currency: currency.toUpperCase(),
            receipt: 'temp_' + Date.now(), // Temporary receipt ID
            notes: {
                orderData: JSON.stringify(orderData), // Store order data in notes
                customerEmail: orderData.customerEmail
            }
        }

        await razorpayInstance.orders.create(options, (error, razorpayOrder) => {
            if (error) {
                // Environment-aware error logging
                if (isProduction) {
                    console.log('Payment gateway error occurred');
                    console.log('Error type:', error.error?.code || 'unknown');
                } else {
                    console.log('Razorpay error:', error);
                }
                
                // Extract error message from nested structure
                let errorMessage = 'Payment gateway error';
                if (error.error && error.error.description) {
                    errorMessage = error.error.description;
                } else if (error.description) {
                    errorMessage = error.description;
                } else if (error.message) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                
                return res.json({
                    success: false, 
                    message: errorMessage
                })
            }
            
            res.json({
                success: true, 
                order: razorpayOrder,
                orderData: orderData // Send order data to frontend
            })
        })

    } catch (error) {
        console.log('Order creation error:', error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { razorpay_order_id, razorpay_payment_id, orderData } = req.body
        const { userId } = req.user; // Get userId from auth middleware

        // Fetch order from Razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if (orderInfo.status === 'paid') {
            // Create the order in database with payment details
            const finalOrderData = {
                userId: userId,
                customerEmail: orderData.customerEmail,
                customerPhone: orderData.customerPhone,
                items: orderData.items,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                total: orderData.total,
                shippingAddress: orderData.address, // Map address to shippingAddress
                billingAddress: orderData.billingAddress,
                paymentDetails: {
                    method: orderData.paymentMethod,
                    gateway: 'razorpay',
                    gatewayOrderId: razorpay_order_id,
                    transactionId: razorpay_payment_id
                },
                paymentStatus: 'paid',
                paymentDate: new Date(),
                status: 'confirmed',
                // Legacy fields
                amount: orderData.amount,
                address: orderData.address,
                paymentMethod: orderData.paymentMethod,
                payment: true,
                date: Date.now()
            }

            console.log('Creating order with data:', finalOrderData);

            const newOrder = new orderModel(finalOrderData)
            try {
                await newOrder.save()
                console.log('Order created successfully:', newOrder._id);
            } catch (saveError) {
                console.error('Failed to save order:', saveError);
                return res.json({ success: false, message: 'Failed to create order: ' + saveError.message });
            }

            // Send real-time notification to admin
            await NotificationService.sendNewOrderNotification(newOrder)

            // Send order and payment confirmation to customer via WhatsApp
            try {
                await NotificationService.sendOrderAndPaymentConfirmation(newOrder)
            } catch (whatsappError) {
                console.log('Customer WhatsApp notification failed:', whatsappError)
            }

            // Reduce stock for ordered items
            try {
                await reduceStock(newOrder.items);
            } catch (stockError) {
                console.error('Failed to reduce stock:', stockError);
                // Continue with order completion even if stock reduction fails
            }

            // Clear user's cart from both systems
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            
            // Remove only the ordered items from cart collection
            const cart = await cartModel.findOne({ userId });
            if (cart) {
                // Create a set of ordered item combinations (productId + size + color)
                const orderedItemCombinations = new Set(
                    newOrder.items.map(item => 
                        `${item.productId}-${item.size}-${item.color}`
                    )
                );
                
                // Remove only the exact ordered item combinations
                cart.items = cart.items.filter(item => {
                    const itemKey = `${item.productId}-${item.size}-${item.color}`;
                    return !orderedItemCombinations.has(itemKey);
                });
                
                // Recalculate totals
                cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cart.lastUpdated = new Date();
                
                await cart.save();
            }
            
            res.json({ 
                success: true, 
                message: "Payment Successful",
                orderId: newOrder._id
            })
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
        res.status(200).json({success:true,orders:orders})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }

}

// User Order Data For Frontend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.user; // Get userId from auth middleware

        const orders = await orderModel.find({ userId })
        res.status(200).json({success:true,orders:orders})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        // Support both old (req.body.orderId) and new (req.params.id) patterns
        const id = req.params.id || req.body.orderId;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        // Get the current order to check old status
        const currentOrder = await orderModel.findById(id);
        if (!currentOrder) {
            return res.status(404).json({success:false,message:'Order not found'});
        }
        
        const oldStatus = currentOrder.status;

        await orderModel.findByIdAndUpdate(id, { status })
        
        // Send real-time notification for status update
        await NotificationService.sendOrderStatusUpdate(id, oldStatus, status)
        
        res.status(200).json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

export {verifyRazorpay, placeOrderRazorpay, allOrders, userOrders, updateStatus}