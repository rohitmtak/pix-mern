import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Get user's cart
export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.user;
        
        let cart = await cartModel.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            cart = await cartModel.create({
                userId,
                items: [],
                totalItems: 0,
                totalPrice: 0
            });
        }
        
        res.status(200).json({
            success: true,
            cart: {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error('Error getting user cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cart'
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId, name, price, quantity, size, color, imageUrl } = req.body;
        
        let cart = await cartModel.findOne({ userId });
        
        if (!cart) {
            cart = new cartModel({ userId, items: [], totalItems: 0, totalPrice: 0 });
        }
        
        // Check if item already exists with same size and color
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && 
                   item.size === size && 
                   item.color === color
        );
        
        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                productId,
                name,
                price,
                quantity,
                size,
                color,
                imageUrl
            });
        }
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.lastUpdated = new Date();
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart: {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.user;
        
        // Support both old (req.body) and new (req.params.itemId) patterns
        let productId, size, color;
        
        if (req.params.itemId) {
            // New pattern: itemId from params
            const [pid, s, c] = req.params.itemId.split('-');
            productId = pid;
            size = s;
            color = c;
        } else {
            // Old pattern: from request body
            productId = req.body.productId;
            size = req.body.size;
            color = req.body.color;
        }
        
        const { quantity } = req.body;
        
        if (!productId || !size || !color) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size, and color are required'
            });
        }
        
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && 
                   item.size === size && 
                   item.color === color
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.lastUpdated = new Date();
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart'
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId } = req.user;
        
        // Support both old (req.body) and new (req.params.itemId) patterns
        let productId, size, color;
        
        if (req.params.itemId) {
            // New pattern: itemId from params
            const [pid, s, c] = req.params.itemId.split('-');
            productId = pid;
            size = s;
            color = c;
        } else {
            // Old pattern: from request body
            productId = req.body.productId;
            size = req.body.size;
            color = req.body.color;
        }
        
        if (!productId || !size || !color) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size, and color are required'
            });
        }
        
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && 
                   item.size === size && 
                   item.color === color
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        cart.items.splice(itemIndex, 1);
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.lastUpdated = new Date();
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart'
        });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.user;
        
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        cart.lastUpdated = new Date();
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            cart: {
                items: [],
                totalItems: 0,
                totalPrice: 0
            }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
};