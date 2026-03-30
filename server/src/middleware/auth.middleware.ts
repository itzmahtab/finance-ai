import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

interface JwtPayload {
  userId: string
}

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
