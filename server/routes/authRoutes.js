// routes/authRoutes.js
// handles register, login, and logout for my app.
// I keep the logic very explicit so it's easy for me to read later.

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const router = express.Router()

// small helper that creates a json web token for a user id
function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'please enter an email and password.' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res
        .status(409)
        .json({ message: 'this email already has an account.' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({ email, passwordHash })

    const token = createToken(user._id)

    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: 'account created.',
        user: { id: user._id, email: user.email },
      })
  } catch (err) {
    console.error('Error in /register:', err)
    res.status(500).json({ message: 'server error while registering.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'please enter an email and password.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'email or password is wrong.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'email or password is wrong.' })
    }

    const token = createToken(user._id)

    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'logged in.',
        user: { id: user._id, email: user.email },
      })
  } catch (err) {
    console.error('Error in /login:', err)
    res.status(500).json({ message: 'server error while logging in.' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res
    .clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
    })
    .status(200)
    .json({ message: 'logged out.' })
})

export default router
