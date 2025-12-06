import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'

// Load environment-specific .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment files in priority order:
// 1. .env.local (for local development overrides)
// 2. .env.production or .env.development (environment-specific)
// 3. .env (fallback, maintains AWS compatibility)

// Load .env.local first if it exists (local development)
const localEnvPath = path.join(__dirname, '.env.local')
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath })
  console.log('📝 Loaded .env.local')
}

// Load environment-specific file if it exists
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
const envPath = path.join(__dirname, envFile)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true })
  console.log(`📝 Loaded ${envFile}`)
}

// Fallback to .env (maintains AWS compatibility - this is what AWS uses)
const defaultEnvPath = path.join(__dirname, '.env')
if (fs.existsSync(defaultEnvPath)) {
  dotenv.config({ path: defaultEnvPath, override: true })
  console.log('📝 Loaded .env (fallback)')
}

console.log(`📦 Loaded environment: ${process.env.NODE_ENV || 'development'}`)

import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import testRouter from './routes/testRoute.js'
import { generalLimiter } from './middleware/rateLimiter.js'

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('Created uploads directory')
}

const app = express()
app.set('trust proxy', 1)
const port = process.env.PORT || 4000

const httpServer = createServer(app)

// Socket.io CORS (only allow frontend/admin)
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://highstreetpix.com",
      "https://highstreetpix.com",
      "https://admin.highstreetpix.com",
      "https://highstreetpix.netlify.app",
      "http://13.204.195.106",
      "https://13.204.195.106",
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
})

export { app, io }

const initializeApp = async () => {
  try {
    await connectDB()
    await connectCloudinary()

    // CORS fix for production domain & admin
    const allowedOrigins = [
      "http://highstreetpix.com",
      "https://highstreetpix.com",
      "https://admin.highstreetpix.com",
      "https://highstreetpix.netlify.app",
      // Direct server IP access
      "http://13.204.195.106",
      "https://13.204.195.106"
    ]

    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true)

        // Allow local dev ports
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return callback(null, true)
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        }

        // Netlify preview builds
        if (/^https:\/\/.*--highstreetpix\.netlify\.app$/.test(origin)) {
          return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'token', 'Origin', 'Accept'],
      optionsSuccessStatus: 204
    }

    app.use(cors(corsOptions))
    app.options('*', cors(corsOptions))

    // Security
    app.use(helmet({
      contentSecurityPolicy: false
    }))

    app.use(cookieParser())
    app.use('/api', generalLimiter)
    app.use(express.json())

    // Routes
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/test', testRouter)

    app.get('/', (req, res) => {
      res.json({ success: true, message: "PIX MERN API Running" })
    })

    app.get('/api', (req, res) => {
      res.json({ success: true, message: "API Healthy" })
    })

    // Socket.io
    io.on('connection', (socket) => {
      console.log('Admin socket connected:', socket.id)
      socket.join("admin")

      socket.on("disconnect", () => {
        console.log('❌ Admin socket disconnected:', socket.id)
      })
    })

    httpServer.listen(port, '0.0.0.0', () => {
      console.log("Server running on PORT:", port)
    })

  } catch (error) {
    console.error("❌ Startup Error:", error)
    process.exit(1)
  }
}

initializeApp()