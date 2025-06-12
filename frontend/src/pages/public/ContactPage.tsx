"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import PublicLayout from "../../components/layouts/PublicLayout"

const ContactPage: React.FC = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate form
      if (!formData.customerName || !formData.message) {
        toast.error("Please fill in all required fields")
        return
      }

      await api.post("/messages", {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone || undefined,
        customerEmail: formData.customerEmail || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      })

      toast.success("Message sent successfully!")
      navigate("/")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

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
                  Phone Number
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
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
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please describe how we can help you..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}

export default ContactPage
