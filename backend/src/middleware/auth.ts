import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string }
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}
