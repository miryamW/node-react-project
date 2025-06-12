"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Appointment, Service, Customer } from "@/lib/database"
import { Trash2 } from "lucide-react"

interface AppointmentsTableProps {
  appointments: Appointment[]
  services: Service[]
  customers: Customer[]
}

export function AppointmentsTable({ appointments: initialAppointments, services, customers }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [sortBy, setSortBy] = useState<"date" | "customer">("date")

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    } else {
      return (a.customer_name || "").localeCompare(b.customer_name || "")
    }
  })

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
      }
    } catch (error) {
      console.error("Failed to update appointment:", error)
    }
  }

  const handleDelete = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId))
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Appointments ({appointments.length})</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value: "date" | "customer") => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="customer">Sort by Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Service</th>
                <th className="text-left py-2">Date & Time</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Notes</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="py-3">{appointment.customer_name}</td>
                  <td className="py-3">{appointment.service_name}</td>
                  <td className="py-3">{new Date(appointment.appointment_date).toLocaleString()}</td>
                  <td className="py-3">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 max-w-xs truncate">{appointment.notes || "-"}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(appointment.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
