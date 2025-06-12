import { checkAuth } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/navigation"
import { ServicesTable } from "@/components/admin/services-table"
import { db } from "@/lib/database"

export default async function AdminServicesPage() {
  await checkAuth()

  const services = await db.getAllServices()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Services Management</h1>
        <ServicesTable services={services} />
      </div>
    </div>
  )
}
