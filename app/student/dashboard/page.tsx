import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsOverview } from "@/components/student/stats-overview"
import { RecentActivity } from "@/components/student/recent-activity"
import { SkillsChart } from "@/components/student/skills-chart"
import { ClientOnly } from "@/components/client-only"
import { serializeUser } from "@/lib/serialize"
import type { StudentProfile } from "@/lib/types"

export default async function StudentDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "student") {
    redirect("/login")
  }

  const student = serializeUser(user) as StudentProfile

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <DashboardHeader
        title="Dashboard"
        description="Track your coding progress across all platforms"
      />
      <div className="flex-1 space-y-8 p-6">
        {/* Stats Overview with Connected Platforms */}
        <ClientOnly fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl h-32 border border-gray-700"></div>
              </div>
            ))}
          </div>
        }>
          <StatsOverview student={student} />
        </ClientOnly>

        {/* Bottom Row: Skills Distribution and Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ClientOnly fallback={<div className="animate-pulse bg-gray-800 rounded-xl h-80 border border-gray-700"></div>}>
            <SkillsChart student={student} />
          </ClientOnly>
          <ClientOnly fallback={<div className="animate-pulse bg-gray-800 rounded-xl h-80 border border-gray-700"></div>}>
            <RecentActivity student={student} />
          </ClientOnly>
        </div>
      </div>
    </div>
  )
}
