import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',() => {
            console.log("DB Connected");
        })

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        throw error
    }
}

export default connectDB;