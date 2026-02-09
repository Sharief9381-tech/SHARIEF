import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Only allow admin users to access admin routes
  if (user.email !== "sharief9381@gmail.com") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}