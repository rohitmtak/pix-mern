import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import razorpay from 'razorpay'

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
                message: `Order amount ₹${total.toLocaleString()} exceeds the maximum allowed amount of ₹${maxAmount.toLocaleString()}. Please split your order into ${suggestedParts} parts or contact support.`,
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
                // Reduce stock for ordered items
                try {
                    await reduceStock(updatedOrder.items);
                } catch (stockError) {
                    console.error('Failed to reduce stock:', stockError);
                    // Continue with order completion even if stock reduction fails
                }

                // Clear user's cart from both systems
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                
                // Remove only the ordered items from cart collection
                const cart = await cartModel.findOne({ userId });
                if (cart) {
                    // Get the ordered item IDs
                    const orderedItemIds = updatedOrder.items.map(item => item.productId.toString());
                    
                    // Remove only the ordered items
                    cart.items = cart.items.filter(item => 
                        !orderedItemIds.includes(item.productId.toString())
                    );
                    
                    // Recalculate totals
                    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    cart.lastUpdated = new Date();
                    
                    await cart.save();
                }
                
                res.json({ 
                    success: true, 
                    message: "Payment Successful",
                    orderId: updatedOrder._id
                })
            } else {
                // Fallback to legacy method if new method fails
                await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                
                // Also clear the cart collection in fallback
                await cartModel.findOneAndUpdate({ userId }, { 
                    items: [], 
                    totalItems: 0, 
                    totalPrice: 0,
                    lastUpdated: new Date()
                });
                
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