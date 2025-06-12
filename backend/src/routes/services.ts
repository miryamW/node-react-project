import express from "express"
import { dbService } from "../db"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get all active services (public)
router.get("/", async (req, res) => {
  try {
    const services = await dbService.getServices()
    res.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all services including inactive (protected)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const services = await dbService.getAllServices()
    res.json(services)
  } catch (error) {
    console.error("Error fetching all services:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get service by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const service = await dbService.getServiceById(id)

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new service (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, price, duration, active } = req.body

    // Validate required fields
    if (!name || price === undefined || duration === undefined) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const service = await dbService.addService({
      name,
      description,
      price,
      duration,
      active: active !== false,
    })

    res.status(201).json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update service (protected)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    await dbService.updateService(id, req.body)
    const updatedService = await dbService.getServiceById(id)

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete service (protected)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    await dbService.deleteService(id)
    res.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
