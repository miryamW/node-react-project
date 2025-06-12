import { checkAuth } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/navigation"
import { AppointmentsTable } from "@/components/admin/appointments-table"
import { db } from "@/lib/database"

export default async function AdminAppointmentsPage() {
  await checkAuth()

  const appointments = await db.getAppointments()
  const services = await db.getAllServices()
  const customers = await db.getCustomers()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointments Management</h1>
        <AppointmentsTable appointments={appointments} services={services} customers={customers} />
      </div>
    </div>
  )
}
