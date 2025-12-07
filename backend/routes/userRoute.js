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
  verifyResetToken,
  refreshToken,
  logout,
  changeAdminPassword
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'
import { loginLimiter, passwordResetLimiter, registerLimiter } from '../middleware/rateLimiter.js'

const userRouter = express.Router();

userRouter.post('/register', registerLimiter, registerUser)
userRouter.post('/login', loginLimiter, loginUser)
userRouter.post('/admin', loginLimiter, adminLogin)
userRouter.post('/logout', logout)
userRouter.post('/refresh-token', refreshToken)

// Password reset routes
userRouter.post('/forgot-password', passwordResetLimiter, forgotPassword)
userRouter.post('/reset-password', passwordResetLimiter, resetPassword)
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

// Admin password change
userRouter.post('/admin/change-password', adminAuth, changeAdminPassword)

export default userRouter;