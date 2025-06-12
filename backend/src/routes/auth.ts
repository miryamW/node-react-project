import express from "express"
import jwt from "jsonwebtoken"
import { dbService } from "../db"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    const user = await dbService.validateAdminCredentials(username, password)

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" })

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    return res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Server error" })
  }
})

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token")
  return res.json({ message: "Logout successful" })
})

// Check auth status
router.get("/status", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ authenticated: false })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.json({ authenticated: true, user: decoded })
  } catch (error) {
    return res.status(401).json({ authenticated: false })
  }
})

export default router
