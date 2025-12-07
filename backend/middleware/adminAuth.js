import jwt from 'jsonwebtoken'
import tokenBlacklist from '../utils/tokenBlacklist.js'
import Admin from '../models/adminModel.js'

const adminAuth = async (req,res,next) => {
    try {
        const token = req.cookies.token || req.headers.token
        if (!token) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        // Check if token is blacklisted
        if (tokenBlacklist.isBlacklisted(token)) {
            return res.json({success:false,message:"Token has been invalidated. Please login again."})
        }
        
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        
        // Check if the user has admin role
        if (token_decode.role !== 'admin' && token_decode.role !== 'superadmin') {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        // Verify admin exists in database and token matches active session
        const admin = await Admin.findById(token_decode.id);
        if (!admin) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        // Check if token matches active session (optional but recommended for security)
        if (admin.activeSessionId !== token) {
            return res.json({success:false,message:"Session expired. Please login again."})
        }
        
        // Attach admin info to request for use in routes
        req.admin = {
            id: admin._id,
            email: admin.email,
            role: admin.role
        }
        
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth