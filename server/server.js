// server.js
// main file for my backend.
// sets up express, connects to mongo, and mounts auth routes.

import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

// connect to MongoDB first
connectDB()

// let express read json bodies
app.use(express.json())

// make cookies usable (for authToken)
app.use(cookieParser())

// allow my React frontend to call this api in dev
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

// simple health route so I can check if backend is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'auth backend is running.' })
})

// mount auth routes at /api/auth
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
