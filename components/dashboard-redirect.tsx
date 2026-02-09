"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function DashboardRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Don't redirect if user explicitly wants to see the homepage
    const showHomepage = searchParams.get('home') === 'true'
    if (showHomepage) return

    const checkAuthAndRedirect = async () => {
      try {
        const response = await fetch("/api/auth/user")
        if (response.ok) {
          const { user } = await response.json()
          
          console.log("DashboardRedirect - User data:", user)
          console.log("DashboardRedirect - User role:", user.role)
          console.log("DashboardRedirect - User email:", user.email)
          
          // Handle admin role
          if (user.role === "admin" || user.email === "sharief9381@gmail.com") {
            console.log("DashboardRedirect - Redirecting to admin")
            router.push("/admin")
            return
          }
          
          // Regular users go to their role-based dashboard
          const redirectPath = `/${user.role}/dashboard`
          console.log("DashboardRedirect - Redirecting to:", redirectPath)
          router.push(redirectPath)
        }
      } catch (error) {
        // User not authenticated, stay on landing page
        console.log("User not authenticated", error)
      }
    }

    checkAuthAndRedirect()
  }, [router, searchParams])

  return null
}