import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    id: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "IN" },
    isDefault: { type: Boolean, default: false }
}, { _id: false })

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    addresses: { type: [addressSchema], default: [] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product', default: [] }],
    cartData: { type: Object, default: {} },
    lastLoginAt: { type: Date },
    role: { type: String, enum: ['user','admin'], default: 'user' },
    // Session management
    activeSessionId: { type: String, default: null },
    // Password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { minimize: false, timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel