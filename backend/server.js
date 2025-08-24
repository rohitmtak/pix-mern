import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('Created uploads directory')
}

// App Config
const app = express()
const port = process.env.PORT || 4000

// Initialize database and cloudinary connections
const initializeApp = async () => {
    try {
        await connectDB()
        await connectCloudinary()
        
        // middlewares
        app.use(express.json())
        app.use(cors({
            origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
        }))

        // api endpoints
        app.use('/api/user',userRouter)
        app.use('/api/product',productRouter)
        app.use('/api/cart',cartRouter)
        app.use('/api/order',orderRouter)

        // Root health check for frontend
        app.get('/',(req,res)=>{
            res.json({ 
                success: true,
                message: "PIX MERN API is running",
                version: "1.0.0",
                endpoints: {
                    products: "/api/product",
                    users: "/api/user", 
                    cart: "/api/cart",
                    orders: "/api/order"
                }
            })
        })

        // API health check
        app.get('/api',(req,res)=>{
            res.json({ 
                success: true,
                message: "API Working",
                status: "healthy"
            })
        })

        app.listen(port, ()=> console.log('Server started on PORT : '+ port))
    } catch (error) {
        console.error('Failed to initialize app:', error)
        process.exit(1)
    }
}

initializeApp()