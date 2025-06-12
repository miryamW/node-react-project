import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
