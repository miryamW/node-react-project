import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function checkAuth() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin-auth")?.value === "true"

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return true
}

export async function setAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set("admin-auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth")
}
