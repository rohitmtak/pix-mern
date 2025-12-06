import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        index: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'superadmin'], 
        default: 'admin' 
    },
    lastLoginAt: { 
        type: Date 
    },
    // Session management
    activeSessionId: { 
        type: String, 
        default: null 
    },
    // Password reset fields (optional, for future use)
    resetPasswordToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date 
    }
}, { 
    minimize: false, 
    timestamps: true 
})

const Admin = mongoose.models.admin || mongoose.model('admin', adminSchema);

export default Admin

