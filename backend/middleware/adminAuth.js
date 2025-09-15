import jwt from 'jsonwebtoken'
import tokenBlacklist from '../utils/tokenBlacklist.js'

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
        if (token_decode.role !== 'admin' || token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth