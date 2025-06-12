import axios from "axios"

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases here
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login or handle differently
      console.log("Unauthorized request")
    }
    return Promise.reject(error)
  },
)
