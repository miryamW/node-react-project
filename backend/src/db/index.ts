import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// Database interfaces
export interface BusinessDetails {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  active: boolean
  created_at: string
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

export interface AdminUser {
  id: number
  username: string
  password: string
}

// Initialize database
const dbFile = path.resolve(__dirname, "../../../database.sqlite")
const dbExists = fs.existsSync(dbFile)

export async function getDb() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  })

  if (!dbExists) {
    await initializeDatabase(db)
  }

  return db
}

async function initializeDatabase(db: any) {
  // Create tables
  await db.exec(`
    -- Business details table
    CREATE TABLE IF NOT EXISTS business_details (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Services table
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      duration INTEGER, -- duration in minutes
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Appointments table
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      service_id INTEGER,
      appointment_date DATETIME NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    -- Messages table
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      customer_email TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      read_status BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Admin users table
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `)

  // Insert default data
  await db.run(`
    INSERT INTO business_details (id, name, description, address, phone, email) 
    VALUES (
      1, 
      'Wellness Center Pro', 
      'Professional wellness and consultation services for your health and wellbeing.',
      '123 Wellness Street, Health City, HC 12345',
      '+1 (555) 123-4567',
      'info@wellnesscenter.com'
    );
  `)

  await db.run(`
    INSERT INTO services (name, description, price, duration) VALUES
    ('Individual Consultation', 'One-on-one consultation session tailored to your needs', 120.00, 60),
    ('Group Session', 'Group consultation session for multiple participants', 80.00, 90),
    ('Extended Consultation', 'Extended consultation for complex cases', 200.00, 120),
    ('Follow-up Session', 'Follow-up session for existing clients', 90.00, 45);
  `)

  // Insert default admin user (username: admin, password: admin123)
  // In a real app, you would hash this password
  await db.run(`
    INSERT INTO admin_users (username, password) VALUES ('admin', 'admin123');
  `)

  console.log("Database initialized with default data")
}

// Database access functions
export const dbService = {
  // Business Details
  getBusinessDetails: async (): Promise<BusinessDetails> => {
    const db = await getDb()
    return db.get("SELECT * FROM business_details WHERE id = 1")
  },

  updateBusinessDetails: async (details: Partial<BusinessDetails>): Promise<void> => {
    const db = await getDb()
    const { name, description, address, phone, email } = details

    await db.run(
      `UPDATE business_details 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           address = COALESCE(?, address), 
           phone = COALESCE(?, phone), 
           email = COALESCE(?, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [name, description, address, phone, email],
    )
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const db = await getDb()
    return db.all("SELECT * FROM services WHERE active = 1")
  },

  getAllServices: async (): Promise<Service[]> => {
    const db = await getDb()
    return db.all("SELECT * FROM services")
  },

  getServiceById: async (id: number): Promise<Service> => {
    const db = await getDb()
    return db.get("SELECT * FROM services WHERE id = ?", id)
  },

  addService: async (service: Omit<Service, "id" | "created_at">): Promise<Service> => {
    const db = await getDb()
    const { name, description, price, duration, active } = service

    const result = await db.run(
      `INSERT INTO services (name, description, price, duration, active) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, duration, active === false ? 0 : 1],
    )

    return db.get("SELECT * FROM services WHERE id = ?", result.lastID)
  },

  updateService: async (id: number, updates: Partial<Service>): Promise<void> => {
    const db = await getDb()
    const { name, description, price, duration, active } = updates

    await db.run(
      `UPDATE services 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           price = COALESCE(?, price), 
           duration = COALESCE(?, duration), 
           active = COALESCE(?, active)
       WHERE id = ?`,
      [name, description, price, duration, active === false ? 0 : active === true ? 1 : null, id],
    )
  },

  deleteService: async (id: number): Promise<void> => {
    const db = await getDb()
    await db.run("DELETE FROM services WHERE id = ?", id)
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    const db = await getDb()
    return db.all("SELECT * FROM customers ORDER BY name")
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    const db = await getDb()
    return db.get("SELECT * FROM customers WHERE id = ?", id)
  },

  getCustomerByPhone: async (phone: string): Promise<Customer | undefined> => {
    const db = await getDb()
    return db.get("SELECT * FROM customers WHERE phone = ?", phone)
  },

  addCustomer: async (customer: Omit<Customer, "id" | "created_at">): Promise<Customer> => {
    const db = await getDb()
    const { name, phone, email } = customer

    // Check if customer already exists
    const existingCustomer = await dbService.getCustomerByPhone(phone)
    if (existingCustomer) {
      return existingCustomer
    }

    const result = await db.run(`INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)`, [name, phone, email])

    return db.get("SELECT * FROM customers WHERE id = ?", result.lastID)
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    const db = await getDb()
    const appointments = await db.all(`
      SELECT 
        a.*, 
        c.name as customer_name, 
        s.name as service_name
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date
    `)

    return appointments
  },

  getAppointmentById: async (id: number): Promise<Appointment> => {
    const db = await getDb()
    return db.get(
      `
      SELECT 
        a.*, 
        c.name as customer_name, 
        s.name as service_name
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `,
      id,
    )
  },

  addAppointment: async (
    appointment: Omit<Appointment, "id" | "created_at" | "customer_name" | "service_name">,
  ): Promise<Appointment> => {
    const db = await getDb()
    const { customer_id, service_id, appointment_date, notes, status } = appointment

    const result = await db.run(
      `INSERT INTO appointments (customer_id, service_id, appointment_date, notes, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, service_id, appointment_date, notes, status || "scheduled"],
    )

    return dbService.getAppointmentById(result.lastID)
  },

  updateAppointment: async (id: number, updates: Partial<Appointment>): Promise<void> => {
    const db = await getDb()
    const { customer_id, service_id, appointment_date, notes, status } = updates

    await db.run(
      `UPDATE appointments 
       SET customer_id = COALESCE(?, customer_id), 
           service_id = COALESCE(?, service_id), 
           appointment_date = COALESCE(?, appointment_date), 
           notes = COALESCE(?, notes), 
           status = COALESCE(?, status)
       WHERE id = ?`,
      [customer_id, service_id, appointment_date, notes, status, id],
    )
  },

  deleteAppointment: async (id: number): Promise<void> => {
    const db = await getDb()
    await db.run("DELETE FROM appointments WHERE id = ?", id)
  },

  // Messages
  getMessages: async (): Promise<Message[]> => {
    const db = await getDb()
    return db.all("SELECT * FROM messages ORDER BY created_at DESC")
  },

  getMessageById: async (id: number): Promise<Message> => {
    const db = await getDb()
    return db.get("SELECT * FROM messages WHERE id = ?", id)
  },

  addMessage: async (message: Omit<Message, "id" | "created_at" | "read_status">): Promise<Message> => {
    const db = await getDb()
    const { customer_name, customer_phone, customer_email, subject, message: messageText } = message

    const result = await db.run(
      `INSERT INTO messages (customer_name, customer_phone, customer_email, subject, message, read_status) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [customer_name, customer_phone, customer_email, subject, messageText],
    )

    return dbService.getMessageById(result.lastID)
  },

  markMessageAsRead: async (id: number): Promise<void> => {
    const db = await getDb()
    await db.run("UPDATE messages SET read_status = 1 WHERE id = ?", id)
  },

  // Authentication
  validateAdminCredentials: async (username: string, password: string): Promise<AdminUser | null> => {
    const db = await getDb()
    const user = await db.get("SELECT * FROM admin_users WHERE username = ? AND password = ?", [username, password])

    return user || null
  },
}
