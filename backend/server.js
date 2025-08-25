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
        // CORS configuration
        app.use(cors({
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                
                const allowedOrigins = [
                    'http://localhost:5173',
                    'http://localhost:3000', 
                    'http://localhost:5174',
                    'http://127.0.0.1:5173',
                    'http://127.0.0.1:5174',
                    // Netlify domain
                    'https://highstreetpix.netlify.app'
                ];
                
                if (allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'token', 'Origin', 'Accept'],
            preflightContinue: false,
            optionsSuccessStatus: 204
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