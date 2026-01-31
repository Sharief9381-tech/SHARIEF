import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

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
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System-wide analytics and monitoring
          </p>
        </div>
        <AnalyticsDashboard />
      </div>
    </div>
  )
}