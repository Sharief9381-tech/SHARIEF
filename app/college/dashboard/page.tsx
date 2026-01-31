import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { CollegeStats } from "@/components/college/college-stats"
import { TopPerformers } from "@/components/college/top-performers"
import { PlacementOverview } from "@/components/college/placement-overview"
import { DepartmentBreakdown } from "@/components/college/department-breakdown"
import { serializeUser } from "@/lib/serialize"
import type { CollegeProfile } from "@/lib/types"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function CollegeDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "college") {
    redirect("/login")
  }

  const college = serializeUser(user) as CollegeProfile

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="College Dashboard"
        description={`Welcome back, ${college.collegeName}`}
      />
      <div className="flex-1 space-y-6 p-6">
        <CollegeStats college={college} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PlacementOverview />
            <DepartmentBreakdown />
          </div>
          <div>
            <TopPerformers />
          </div>
        </div>
      </div>
    </div>
  )
}
