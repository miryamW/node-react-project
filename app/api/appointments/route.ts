import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, serviceId, appointmentDate, appointmentTime, notes } = body

    // Create or find customer
    const customer = await db.addCustomer({
      name: customerName,
      phone: customerPhone,
    })

    // Create appointment
    const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`
    const appointment = await db.addAppointment({
      customer_id: customer.id,
      service_id: Number.parseInt(serviceId),
      appointment_date: appointmentDateTime,
      notes: notes || "",
      status: "scheduled",
    })

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
