import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function WebsiteAnalyticsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "college") {
    redirect("/login")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Website Analytics"
        description="Monitor visitor activity and user engagement"
      />
      <div className="flex-1 p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}