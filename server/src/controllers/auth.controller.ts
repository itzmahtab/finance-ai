import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { users, profiles } from '../db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Sequential inserts (Neon HTTP doesn't support transactions yet)
    const [newUser] = await db.insert(users).values({
      email,
      passwordHash,
    }).returning()

    const [newProfile] = await db.insert(profiles).values({
      userId: newUser.id,
      fullName,
      country: 'Bangladesh',
      currency: 'BDT',
    }).returning()

    // Generate token
    const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newProfile.fullName,
        currency: newProfile.currency,
        country: newProfile.country,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    })

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.fullName,
        currency: profile?.currency,
        country: profile?.country,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId),
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.fullName,
        currency: profile?.currency,
        country: profile?.country,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
