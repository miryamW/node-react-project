"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Calendar, Users, MessageSquare, Settings, Briefcase, LogOut } from "lucide-react"

export function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/business", label: "Business Details", icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-1">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
