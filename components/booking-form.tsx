"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Service } from "@/lib/database"

interface BookingFormProps {
  services: Service[]
}

export function BookingForm({ services }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          customerPhone: formData.get("customerPhone"),
          serviceId: formData.get("serviceId"),
          appointmentDate: formData.get("appointmentDate"),
          appointmentTime: formData.get("appointmentTime"),
          notes: formData.get("notes"),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Failed to book appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-green-600">Appointment Booked Successfully!</CardTitle>
          <CardDescription>We'll contact you soon to confirm your appointment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => (window.location.href = "/")}>Return to Homepage</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="customerName">Full Name *</Label>
          <Input id="customerName" name="customerName" type="text" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone Number *</Label>
          <Input id="customerPhone" name="customerPhone" type="tel" required className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="serviceId">Service Type *</Label>
        <Select
          name="serviceId"
          required
          onValueChange={(value) => {
            const service = services.find((s) => s.id.toString() === value)
            setSelectedService(service || null)
          }}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id.toString()}>
                {service.name} - ${service.price} ({service.duration} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedService && <p className="text-sm text-gray-600 mt-2">{selectedService.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="appointmentDate">Preferred Date *</Label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="appointmentTime">Preferred Time *</Label>
          <Input id="appointmentTime" name="appointmentTime" type="time" required className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Any additional information or special requests..."
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  )
}
