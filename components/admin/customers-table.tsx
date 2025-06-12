"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Customer } from "@/lib/database"

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="py-3 font-medium">{customer.name}</td>
                  <td className="py-3">{customer.phone}</td>
                  <td className="py-3">{customer.email || "-"}</td>
                  <td className="py-3">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
