import express from 'express'
import { addToCart, getUserCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

// Legacy routes for backward compatibility
cartRouter.get('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.put('/update', authUser, updateCartItem)
cartRouter.delete('/remove', authUser, removeFromCart)
cartRouter.delete('/clear', authUser, clearCart)

// New RESTful routes (optional - for future use)
cartRouter.get('/', authUser, getUserCart)
cartRouter.post('/', authUser, addToCart)
cartRouter.put('/:itemId', authUser, updateCartItem)
cartRouter.delete('/:itemId', authUser, removeFromCart)

export default cartRouter