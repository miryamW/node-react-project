"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { api } from "../utils/api"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: { id: number; username: string } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  login: async () => false,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string } | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/auth/status")
        if (response.data.authenticated) {
          setIsAuthenticated(true)
          setUser(response.data.user)
        }
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { username, password })
      setIsAuthenticated(true)
      setUser(response.data.user)
      return true
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout")
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>{children}</AuthContext.Provider>
  )
}
