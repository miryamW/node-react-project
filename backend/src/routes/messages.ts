import express from "express"
import { dbService } from "../db"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get all messages (protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const messages = await dbService.getMessages()
    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get message by ID (protected)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const message = await dbService.getMessageById(id)

    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    res.json(message)
  } catch (error) {
    console.error("Error fetching message:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new message (public)
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, subject, message } = req.body

    // Validate required fields
    if (!customerName || !message) {
      return res.status(400).json({ message: "Name and message are required" })
    }

    const newMessage = await dbService.addMessage({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      subject,
      message,
    })

    res.status(201).json(newMessage)
  } catch (error) {
    console.error("Error creating message:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Mark message as read (protected)
router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    await dbService.markMessageAsRead(id)
    const updatedMessage = await dbService.getMessageById(id)

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" })
    }

    res.json(updatedMessage)
  } catch (error) {
    console.error("Error marking message as read:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
