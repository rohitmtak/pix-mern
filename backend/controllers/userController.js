import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import userModel from "../models/userModel.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/emailService.js";
import tokenBlacklist from "../utils/tokenBlacklist.js";
import { validatePassword } from "../utils/passwordValidator.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            user.lastLoginAt = new Date()
            
            // Generate new token and update session
            const token = createToken(user._id)
            user.activeSessionId = token
            await user.save()
            
            // Set httpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            
            res.status(200).json({ success: true, message: 'Login successful' })
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
        
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Password requirements not met",
                errors: passwordValidation.errors
            })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        
        // Update session
        user.activeSessionId = token
        await user.save()
        
        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        })

        res.status(201).json({ success: true, message: 'Registration successful' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        // Validate admin credentials
        if (email !== process.env.ADMIN_EMAIL) {
            return res.json({success:false,message:"Invalid credentials"})
        }

        // Hash the provided password and compare with stored hash
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminPasswordHash) {
            console.error('ADMIN_PASSWORD_HASH not configured in environment variables');
            return res.json({success:false,message:"Server configuration error"})
        }

        const isMatch = await bcrypt.compare(password, adminPasswordHash);
        
        if (isMatch) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15m' });
            
            // Set httpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            
            res.json({success:true, message: 'Admin login successful'})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// Authenticated: get current user profile
const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('name email phone addresses wishlist createdAt')
        if (!user) return res.json({ success: false, message: 'User not found' })
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update profile fields
const updateMe = async (req, res) => {
    try {
        const { name, phone } = req.body
        const user = await userModel.findByIdAndUpdate(
            req.user.userId,
            { $set: { ...(name !== undefined ? { name } : {}), ...(phone !== undefined ? { phone } : {}) } },
            { new: true, select: 'name email phone addresses wishlist createdAt' }
        )
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Addresses CRUD
const listAddresses = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('addresses')
        res.json({ success: true, addresses: user?.addresses || [] })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const addAddress = async (req, res) => {
    try {
        const address = req.body.address
        if (!address || !address.id) return res.json({ success: false, message: 'Address id required' })
        const user = await userModel.findById(req.user.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        
        // Check for duplicate addresses
        const isDuplicate = user.addresses.some(existingAddr => 
            existingAddr.fullName === address.fullName &&
            existingAddr.phone === address.phone &&
            existingAddr.line1 === address.line1 &&
            existingAddr.line2 === address.line2 &&
            existingAddr.city === address.city &&
            existingAddr.state === address.state &&
            existingAddr.postalCode === address.postalCode &&
            existingAddr.country === address.country
        );
        
        if (isDuplicate) {
            return res.json({ success: false, message: 'Address already exists' })
        }
        
        if (address.isDefault) {
            user.addresses.forEach(a => a.isDefault = false)
        }
        user.addresses.push(address)
        await user.save()
        res.json({ success: true, addresses: user.addresses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateAddress = async (req, res) => {
    try {
        const { id } = req.params
        const patch = req.body.address || {}
        const user = await userModel.findById(req.user.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        const idx = user.addresses.findIndex(a => a.id === id)
        if (idx === -1) return res.json({ success: false, message: 'Address not found' })
        if (patch.isDefault) {
            user.addresses.forEach(a => a.isDefault = false)
        }
        user.addresses[idx] = { ...user.addresses[idx].toObject?.() || user.addresses[idx], ...patch }
        await user.save()
        res.json({ success: true, addresses: user.addresses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        user.addresses = user.addresses.filter(a => a.id !== id)
        await user.save()
        res.json({ success: true, addresses: user.addresses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Wishlist
const listWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('wishlist')
        res.json({ success: true, wishlist: user?.wishlist || [] })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body
        if (!productId) return res.json({ success: false, message: 'productId required' })
        const user = await userModel.findById(req.user.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        const exists = user.wishlist.find(id => String(id) === String(productId))
        if (!exists) user.wishlist.push(productId)
        await user.save()
        res.json({ success: true, wishlist: user.wishlist })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params
        const user = await userModel.findById(req.user.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        user.wishlist = user.wishlist.filter(id => String(id) !== String(productId))
        await user.save()
        res.json({ success: true, wishlist: user.wishlist })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User with this email does not exist" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

        if (emailSent) {
            res.json({ 
                success: true, 
                message: "Password reset email sent successfully. Please check your email." 
            });
        } else {
            res.json({ 
                success: false, 
                message: "Failed to send password reset email. Please try again." 
            });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reset password - verify token and update password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: "Token and new password are required" });
        }

        // Validate new password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.json({ 
                success: false, 
                message: "Password requirements not met",
                errors: passwordValidation.errors
            });
        }

        // Find user with valid reset token
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send success email
        await sendPasswordResetSuccessEmail(user.email, user.name);

        res.json({ 
            success: true, 
            message: "Password reset successful. You can now login with your new password." 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.json({ success: false, message: "Token is required" });
        }

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        res.json({ success: true, message: "Token is valid" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Refresh token - generate new token for existing user
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.token;
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is required' });
        }

        // Verify the existing token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user
        const user = await userModel.findById(token_decode.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Generate new token
        const newToken = createToken(user._id);
        
        // Set httpOnly cookie
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        })
        
        res.status(200).json({ 
            success: true, 
            message: 'Token refreshed successfully'
        });

    } catch (error) {
        console.log('Token refresh error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

// Logout - clear httpOnly cookie and blacklist token
const logout = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.token;
        
        // Blacklist the token
        if (token) {
            tokenBlacklist.addToken(token);
        }
        
        // Clear active session
        if (req.user && req.user.userId) {
            await userModel.findByIdAndUpdate(req.user.userId, { activeSessionId: null });
        }
        
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.log('Logout error:', error);
        res.json({ 
            success: false, 
            message: 'Logout failed' 
        });
    }
};

export { 
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
    logout
}