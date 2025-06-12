import express from "express"
import { dbService } from "../db"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get all customers (protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const customers = await dbService.getCustomers()
    res.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get customer by ID (protected)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const customer = await dbService.getCustomerById(id)

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    res.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new customer (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, phone, email } = req.body

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" })
    }

    const customer = await dbService.addCustomer({
      name,
      phone,
      email,
    })

    res.status(201).json(customer)
  } catch (error) {
    console.error("Error creating customer:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
