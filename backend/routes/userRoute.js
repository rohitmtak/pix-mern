import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  getMe,
  updateMe,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  listWishlist,
  addWishlist,
  removeWishlist,
  forgotPassword,
  resetPassword,
  verifyResetToken
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

// Password reset routes
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/verify-reset-token/:token', verifyResetToken)

// Profile
userRouter.get('/me', authUser, getMe)
userRouter.put('/me', authUser, updateMe)

// Addresses
userRouter.get('/addresses', authUser, listAddresses)
userRouter.post('/addresses', authUser, addAddress)
userRouter.put('/addresses/:id', authUser, updateAddress)
userRouter.delete('/addresses/:id', authUser, deleteAddress)

// Wishlist
userRouter.get('/wishlist', authUser, listWishlist)
userRouter.post('/wishlist', authUser, addWishlist)
userRouter.delete('/wishlist/:productId', authUser, removeWishlist)

export default userRouter;