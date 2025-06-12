import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"

// Routes
import authRoutes from "./routes/auth"
import appointmentsRoutes from "./routes/appointments"
import businessRoutes from "./routes/business"
import servicesRoutes from "./routes/services"
import customersRoutes from "./routes/customers"
import messagesRoutes from "./routes/messages"

// Initialize environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/appointments", appointmentsRoutes)
app.use("/api/business", businessRoutes)
app.use("/api/services", servicesRoutes)
app.use("/api/customers", customersRoutes)
app.use("/api/messages", messagesRoutes)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
