"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required className="mt-1" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
