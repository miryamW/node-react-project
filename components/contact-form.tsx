"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          customerPhone: formData.get("customerPhone"),
          customerEmail: formData.get("customerEmail"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-green-600">Message Sent Successfully!</CardTitle>
          <CardDescription>We'll get back to you as soon as possible.</CardDescription>
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
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input id="customerPhone" name="customerPhone" type="tel" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input id="customerEmail" name="customerEmail" type="email" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" type="text" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Please describe how we can help you..."
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
