import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    await db.updateBusinessDetails(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating business details:", error)
    return NextResponse.json({ error: "Failed to update business details" }, { status: 500 })
  }
}
