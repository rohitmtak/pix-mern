import jwt from 'jsonwebtoken'
import tokenBlacklist from '../utils/tokenBlacklist.js'
import userModel from '../models/userModel.js'

const authUser = async (req, res, next) => {

    const token = req.cookies.token || req.headers.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
    }

    // Check if token is blacklisted
    if (tokenBlacklist.isBlacklisted(token)) {
        return res.status(401).json({ success: false, message: 'Token has been invalidated. Please login again.' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        // Check if this is the active session
        const user = await userModel.findById(token_decode.id);
        if (!user || user.activeSessionId !== token) {
            return res.status(401).json({ success: false, message: 'Session invalidated. Please login again.' })
        }
        
        req.user = { userId: token_decode.id }
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: error.message })
    }

}

export default authUser