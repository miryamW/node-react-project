import express from "express"
import { dbService } from "../db"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get all appointments (protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const appointments = await dbService.getAppointments()
    res.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get appointment by ID (protected)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const appointment = await dbService.getAppointmentById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new appointment (public)
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, serviceId, appointmentDate, notes } = req.body

    // Validate required fields
    if (!customerName || !customerPhone || !serviceId || !appointmentDate) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Create or find customer
    const customer = await dbService.addCustomer({
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
    })

    // Create appointment
    const appointment = await dbService.addAppointment({
      customer_id: customer.id,
      service_id: Number.parseInt(serviceId),
      appointment_date: appointmentDate,
      notes: notes || "",
      status: "scheduled",
    })

    res.status(201).json(appointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update appointment (protected)
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const updates = req.body

    await dbService.updateAppointment(id, updates)
    const updatedAppointment = await dbService.getAppointmentById(id)

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete appointment (protected)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    await dbService.deleteAppointment(id)
    res.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
