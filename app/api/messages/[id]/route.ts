import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = Number.parseInt(params.id)
    await db.markMessageAsRead(messageId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}
