import { checkAuth } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/navigation"
import { BusinessDetailsForm } from "@/components/admin/business-details-form"
import { db } from "@/lib/database"

export default async function AdminBusinessPage() {
  await checkAuth()

  const businessDetails = await db.getBusinessDetails()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Business Details</h1>
        <BusinessDetailsForm businessDetails={businessDetails} />
      </div>
    </div>
  )
}
