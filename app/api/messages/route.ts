import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, customerEmail, subject, message } = body

    const newMessage = await db.addMessage({
      customer_name: customerName,
      customer_phone: customerPhone || "",
      customer_email: customerEmail || "",
      subject: subject || "",
      message: message,
    })

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
