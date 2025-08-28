import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            user.lastLoginAt = new Date()
            await user.save()
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
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

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET);
            res.json({success:true,token})
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

export { loginUser, registerUser, adminLogin, getMe, updateMe, listAddresses, addAddress, updateAddress, deleteAddress, listWishlist, addWishlist, removeWishlist }