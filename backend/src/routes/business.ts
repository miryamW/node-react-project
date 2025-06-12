import express from "express"
import { dbService } from "../db"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get business details (public)
router.get("/", async (req, res) => {
  try {
    const businessDetails = await dbService.getBusinessDetails()
    res.json(businessDetails)
  } catch (error) {
    console.error("Error fetching business details:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update business details (protected)
router.put("/", authenticateToken, async (req, res) => {
  try {
    await dbService.updateBusinessDetails(req.body)
    const updatedDetails = await dbService.getBusinessDetails()
    res.json(updatedDetails)
  } catch (error) {
    console.error("Error updating business details:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
