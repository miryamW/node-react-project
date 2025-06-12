"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import PublicLayout from "../../components/layouts/PublicLayout"
import type { Service } from "../../types"

const BookingPage: React.FC = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services")
        setServices(response.data)
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "serviceId") {
      const service = services.find((s) => s.id.toString() === value)
      setSelectedService(service || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate form
      if (
        !formData.customerName ||
        !formData.customerPhone ||
        !formData.serviceId ||
        !formData.appointmentDate ||
        !formData.appointmentTime
      ) {
        toast.error("Please fill in all required fields")
        return
      }

      // Format appointment date and time
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`

      await api.post("/appointments", {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        serviceId: formData.serviceId,
        appointmentDate: appointmentDateTime,
        notes: formData.notes,
      })

      toast.success("Appointment booked successfully!")
      navigate("/")
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error("Failed to book appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book an Appointment</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.customerPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type *
              </label>
              <select
                id="serviceId"
                name="serviceId"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.serviceId}
                onChange={handleChange}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
              {selectedService && <p className="text-sm text-gray-600 mt-2">{selectedService.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <input
                  id="appointmentTime"
                  name="appointmentTime"
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information or special requests..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}

export default BookingPage
