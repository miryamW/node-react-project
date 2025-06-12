import { BookingForm } from "@/components/booking-form"
import { db } from "@/lib/database"

export default async function BookPage() {
  const services = await db.getServices()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book an Appointment</h1>
          <BookingForm services={services} />
        </div>
      </div>
    </div>
  )
}
