import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getCurrentUser()

  // Only allow admin users to access this page
  if (!user || user.email !== "admin@codetrack.com") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  )
}