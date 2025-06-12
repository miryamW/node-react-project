"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Service } from "@/lib/database"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface ServicesTableProps {
  services: Service[]
}

export function ServicesTable({ services: initialServices }: ServicesTableProps) {
  const [services, setServices] = useState(initialServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const serviceData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      duration: Number.parseInt(formData.get("duration") as string),
      active: true,
    }

    try {
      if (editingService) {
        // Update existing service
        const response = await fetch(`/api/admin/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        })

        if (response.ok) {
          setServices((prev) =>
            prev.map((service) => (service.id === editingService.id ? { ...service, ...serviceData } : service)),
          )
        }
      } else {
        // Create new service
        const response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        })

        if (response.ok) {
          const newService = await response.json()
          setServices((prev) => [...prev, newService])
        }
      }

      setIsDialogOpen(false)
      setEditingService(null)
    } catch (error) {
      console.error("Error saving service:", error)
      alert("Failed to save service. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setServices((prev) => prev.filter((service) => service.id !== serviceId))
      }
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingService(null)
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Services ({services.length})</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Service Name *</Label>
                  <Input id="name" name="name" type="text" required defaultValue={editingService?.name || ""} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={editingService?.description || ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingService?.price || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      required
                      defaultValue={editingService?.duration || ""}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Service"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b">
                  <td className="py-3 font-medium">{service.name}</td>
                  <td className="py-3 max-w-xs truncate">{service.description}</td>
                  <td className="py-3">${service.price}</td>
                  <td className="py-3">{service.duration} min</td>
                  <td className="py-3">
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
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
