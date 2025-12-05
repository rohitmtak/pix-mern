import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import testRouter from './routes/testRoute.js'
import { generalLimiter, loginLimiter, passwordResetLimiter, registerLimiter } from './middleware/rateLimiter.js'

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
// Trust proxy so secure cookies work behind Render/Netlify proxies
app.set('trust proxy', 1)
const port = process.env.PORT || 4000

// Create HTTP server and Socket.io
const httpServer = createServer(app)

// Socket.io CORS configuration - supports both local development and production
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      // Allow all localhost ports for local development (flexible for any port)
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true)
      }
      
      // Allow AWS Lightsail IP addresses (for production deployments)
      // This allows http://13.204.195.106 and any port variations
      const isAWSIP = /^https?:\/\/13\.204\.195\.106(:\d+)?$/.test(origin)
      
      // Allow Netlify production and preview deployments
      const isNetlify = origin === "https://highstreetpix.netlify.app" || 
                       /^https:\/\/.*--highstreetpix\.netlify\.app$/.test(origin)
      
      if (isAWSIP || isNetlify) {
        return callback(null, true)
      }
      
      callback(new Error('Not allowed by CORS'))
    },
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Export app and io for testing
export { app, io }

// Initialize database and cloudinary connections
const initializeApp = async () => {
    try {
        await connectDB()
        await connectCloudinary()
        
        // CORS configuration (must be BEFORE any rate limiters or routes)
        // Allow credentials and a flexible list of production origins
        const envOrigins = (process.env.FRONTEND_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
        const defaultAllowedOrigins = [
            'https://highstreetpix.netlify.app'
        ]
        const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])]

        const corsOptions = {
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true)

                // Allow all localhost ports for development
                if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                    return callback(null, true)
                }

                // Allow AWS Lightsail IP addresses (for production deployments)
                // This allows http://13.204.195.106 and any port variations
                const isAWSIP = /^https?:\/\/13\.204\.195\.106(:\d+)?$/.test(origin)
                
                // Allow Netlify deploy previews (e.g., https://<hash>--highstreetpix.netlify.app)
                const isNetlifyPreview = /https:\/\/.*--highstreetpix\.netlify\.app$/.test(origin)
                const isAllowedExplicit = allowedOrigins.includes(origin)

                if (isAllowedExplicit || isNetlifyPreview || isAWSIP) {
                    return callback(null, true)
                }

                callback(new Error('Not allowed by CORS'))
            },
            credentials: true, // Allow cookies
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'token', 'Origin', 'Accept'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }
        app.use(cors(corsOptions))
        // Handle preflight for all routes
        app.options('*', cors(corsOptions))

        // Security middlewares
        app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    // Allow Razorpay checkout script and inline handlers it requires
                    scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
                    // Allow images and icons from https
                    imgSrc: ["'self'", 'data:', 'https:'],
                    // Allow XHR/WebSocket to https and wss (Razorpay and our APIs)
                    connectSrc: ["'self'", 'https:', 'wss:']
                },
            },
            crossOriginEmbedderPolicy: false
        }))
        
        // Cookie parser
        app.use(cookieParser())
        
        // Rate limiting (after CORS so preflight gets CORS headers)
        app.use('/api', generalLimiter)
        
        // JSON body parser
        app.use(express.json())

        // api endpoints
        app.use('/api/user',userRouter)
        app.use('/api/product',productRouter)
        app.use('/api/cart',cartRouter)
        app.use('/api/order',orderRouter)
        app.use('/api/test',testRouter)

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

        // Socket.io connection handling
        io.on('connection', (socket) => {
          console.log('🟢 Admin connected:', socket.id)
          
          // Join admin room
          socket.join('admin')
          
          socket.on('disconnect', () => {
            console.log('🔴 Admin disconnected:', socket.id)
          })
        })

        httpServer.listen(port, ()=> console.log('🚀 Server started on PORT : '+ port))
        console.log('📡 Socket.io server ready for real-time notifications')
    } catch (error) {
        console.error('Failed to initialize app:', error)
        process.exit(1)
    }
}

initializeApp()