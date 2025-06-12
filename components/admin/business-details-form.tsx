"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BusinessDetails } from "@/lib/database"

interface BusinessDetailsFormProps {
  businessDetails: BusinessDetails
}

export function BusinessDetailsForm({ businessDetails }: BusinessDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/admin/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          address: formData.get("address"),
          phone: formData.get("phone"),
          email: formData.get("email"),
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        throw new Error("Failed to update business details")
      }
    } catch (error) {
      console.error("Error updating business details:", error)
      alert("Failed to update business details. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Business Name *</Label>
            <Input id="name" name="name" type="text" required defaultValue={businessDetails.name} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={businessDetails.description}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" rows={3} defaultValue={businessDetails.address} className="mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={businessDetails.phone} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={businessDetails.email} className="mt-1" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Business Details"}
            </Button>
          </div>

          {isSuccess && <div className="text-green-600 text-center">Business details updated successfully!</div>}
        </form>
      </CardContent>
    </Card>
  )
}
