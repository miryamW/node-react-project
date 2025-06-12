// Database utility functions
export interface BusinessDetails {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  active: boolean
}

export interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  created_at: string
}

export interface Appointment {
  id: number
  customer_id: number
  service_id: number
  appointment_date: string
  notes?: string
  status: string
  created_at: string
  customer_name?: string
  service_name?: string
}

export interface Message {
  id: number
  customer_name: string
  customer_phone?: string
  customer_email?: string
  subject?: string
  message: string
  read_status: boolean
  created_at: string
}

// Mock database functions - in a real app, these would connect to your database
const mockBusinessDetails: BusinessDetails = {
  id: 1,
  name: "Wellness Center Pro",
  description: "Professional wellness and consultation services for your health and wellbeing.",
  address: "123 Wellness Street, Health City, HC 12345",
  phone: "+1 (555) 123-4567",
  email: "info@wellnesscenter.com",
}

let mockServices: Service[] = [
  {
    id: 1,
    name: "Individual Consultation",
    description: "One-on-one consultation session",
    price: 120,
    duration: 60,
    active: true,
  },
  { id: 2, name: "Group Session", description: "Group consultation session", price: 80, duration: 90, active: true },
  {
    id: 3,
    name: "Extended Consultation",
    description: "Extended consultation for complex cases",
    price: 200,
    duration: 120,
    active: true,
  },
]

const mockCustomers: Customer[] = [
  { id: 1, name: "John Smith", phone: "+1-555-0101", email: "john@email.com", created_at: "2024-01-15" },
  { id: 2, name: "Sarah Johnson", phone: "+1-555-0102", email: "sarah@email.com", created_at: "2024-01-16" },
]

let mockAppointments: Appointment[] = [
  {
    id: 1,
    customer_id: 1,
    service_id: 1,
    appointment_date: "2024-12-20T10:00:00",
    notes: "First consultation",
    status: "scheduled",
    created_at: "2024-12-12",
    customer_name: "John Smith",
    service_name: "Individual Consultation",
  },
]

const mockMessages: Message[] = [
  {
    id: 1,
    customer_name: "Jane Doe",
    customer_phone: "+1-555-0199",
    customer_email: "jane@email.com",
    subject: "Question about services",
    message: "I would like to know more about your consultation services.",
    read_status: false,
    created_at: "2024-12-12T09:30:00",
  },
]

export const db = {
  // Business Details
  getBusinessDetails: async (): Promise<BusinessDetails> => {
    return mockBusinessDetails
  },

  updateBusinessDetails: async (details: Partial<BusinessDetails>): Promise<void> => {
    Object.assign(mockBusinessDetails, details)
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    return mockServices.filter((s) => s.active)
  },

  getAllServices: async (): Promise<Service[]> => {
    return mockServices
  },

  addService: async (service: Omit<Service, "id">): Promise<Service> => {
    const newService = { ...service, id: Date.now() }
    mockServices.push(newService)
    return newService
  },

  updateService: async (id: number, updates: Partial<Service>): Promise<void> => {
    const index = mockServices.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockServices[index] = { ...mockServices[index], ...updates }
    }
  },

  deleteService: async (id: number): Promise<void> => {
    mockServices = mockServices.filter((s) => s.id !== id)
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    return mockCustomers
  },

  addCustomer: async (customer: Omit<Customer, "id" | "created_at">): Promise<Customer> => {
    const newCustomer = {
      ...customer,
      id: Date.now(),
      created_at: new Date().toISOString().split("T")[0],
    }
    mockCustomers.push(newCustomer)
    return newCustomer
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    return mockAppointments.map((apt) => ({
      ...apt,
      customer_name: mockCustomers.find((c) => c.id === apt.customer_id)?.name || "Unknown",
      service_name: mockServices.find((s) => s.id === apt.service_id)?.name || "Unknown",
    }))
  },

  addAppointment: async (
    appointment: Omit<Appointment, "id" | "created_at" | "customer_name" | "service_name">,
  ): Promise<Appointment> => {
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      created_at: new Date().toISOString().split("T")[0],
    }
    mockAppointments.push(newAppointment)
    return {
      ...newAppointment,
      customer_name: mockCustomers.find((c) => c.id === appointment.customer_id)?.name || "Unknown",
      service_name: mockServices.find((s) => s.id === appointment.service_id)?.name || "Unknown",
    }
  },

  updateAppointment: async (id: number, updates: Partial<Appointment>): Promise<void> => {
    const index = mockAppointments.findIndex((a) => a.id === id)
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...updates }
    }
  },

  deleteAppointment: async (id: number): Promise<void> => {
    mockAppointments = mockAppointments.filter((a) => a.id !== id)
  },

  // Messages
  getMessages: async (): Promise<Message[]> => {
    return mockMessages
  },

  addMessage: async (message: Omit<Message, "id" | "created_at" | "read_status">): Promise<Message> => {
    const newMessage = {
      ...message,
      id: Date.now(),
      created_at: new Date().toISOString(),
      read_status: false,
    }
    mockMessages.push(newMessage)
    return newMessage
  },

  markMessageAsRead: async (id: number): Promise<void> => {
    const index = mockMessages.findIndex((m) => m.id === id)
    if (index !== -1) {
      mockMessages[index].read_status = true
    }
  },
}
