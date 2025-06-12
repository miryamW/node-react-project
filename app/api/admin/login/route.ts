import { type NextRequest, NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Simple authentication - in production, use proper password hashing
    if (username === "admin" && password === "admin123") {
      await setAuthCookie()
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
