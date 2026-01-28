import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { serializeUser } from "@/lib/serialize"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "student") {
    redirect(`/${user.role}/dashboard`)
  }

  // Serialize the user object to remove MongoDB-specific properties
  const serializedUser = serializeUser(user)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <DashboardSidebar user={serializedUser} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
