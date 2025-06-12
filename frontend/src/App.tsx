"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Public pages
import HomePage from "./pages/public/HomePage"
import BookingPage from "./pages/public/BookingPage"
import ContactPage from "./pages/public/ContactPage"

// Admin pages
import AdminLoginPage from "./pages/admin/LoginPage"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminAppointments from "./pages/admin/Appointments"
import AdminCustomers from "./pages/admin/Customers"
import AdminMessages from "./pages/admin/Messages"
import AdminServices from "./pages/admin/Services"
import AdminBusinessDetails from "./pages/admin/BusinessDetails"

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/business"
            element={
              <ProtectedRoute>
                <AdminBusinessDetails />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
