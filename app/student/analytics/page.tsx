import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { AnalyticsDashboard } from "@/components/student/analytics-dashboard"
import { serializeUser } from "@/lib/serialize"
import type { StudentProfile } from "@/lib/types"

export default async function AnalyticsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "student") {
    redirect("/login")
  }

  const student = serializeUser(user) as StudentProfile

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <DashboardHeader
        title="Analytics"
        description="Detailed insights into your coding progress and performance"
      />
      <div className="flex-1 p-6">
        <AnalyticsDashboard student={student} />
      </div>
    </div>
  )
}
