import { checkAuth } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/navigation"
import { CustomersTable } from "@/components/admin/customers-table"
import { db } from "@/lib/database"

export default async function AdminCustomersPage() {
  await checkAuth()

  const customers = await db.getCustomers()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customers</h1>
        <CustomersTable customers={customers} />
      </div>
    </div>
  )
}
