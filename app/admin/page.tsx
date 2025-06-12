import { checkAuth } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/database"
import { Calendar, Users, MessageSquare, Settings } from "lucide-react"

export default async function AdminDashboard() {
  await checkAuth()

  const appointments = await db.getAppointments()
  const customers = await db.getCustomers()
  const messages = await db.getMessages()
  const unreadMessages = messages.filter((m) => !m.read_status)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{appointment.customer_name}</p>
                      <p className="text-sm text-gray-600">{appointment.service_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{appointment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest customer messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{message.customer_name}</p>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{new Date(message.created_at).toLocaleDateString()}</p>
                        {!message.read_status && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
