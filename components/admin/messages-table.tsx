"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Message } from "@/lib/database"
import { Eye } from "lucide-react"

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages: initialMessages }: MessagesTableProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const handleMarkAsRead = async (messageId: number) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read_status: true }),
      })

      if (response.ok) {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read_status: true } : msg)))
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error)
    }
  }

  const unreadCount = messages.filter((m) => !m.read_status).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Messages ({messages.length}){unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !message.read_status ? "bg-blue-50 border-blue-200" : "bg-white"
                  } ${selectedMessage?.id === message.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {message.customer_name}
                        {!message.read_status && (
                          <Badge variant="secondary" className="ml-2">
                            New
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{message.subject || "No subject"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(message.created_at).toLocaleDateString()}</p>
                      {!message.read_status && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(message.id)
                          }}
                          className="mt-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{message.message}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {message.customer_phone && <span>📞 {message.customer_phone}</span>}
                    {message.customer_email && <span>✉️ {message.customer_email}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.customer_name}</h3>
                  <p className="text-sm text-gray-600">{selectedMessage.subject || "No subject"}</p>
                </div>

                <div className="space-y-2">
                  {selectedMessage.customer_phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong> {selectedMessage.customer_phone}
                    </p>
                  )}
                  {selectedMessage.customer_email && (
                    <p className="text-sm">
                      <strong>Email:</strong> {selectedMessage.customer_email}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Message:</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {!selectedMessage.read_status && (
                  <Button onClick={() => handleMarkAsRead(selectedMessage.id)} className="w-full">
                    Mark as Read
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a message to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
