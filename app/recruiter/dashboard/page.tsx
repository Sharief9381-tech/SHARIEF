import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { RecruiterStats } from "@/components/recruiter/recruiter-stats"
import { RecommendedCandidates } from "@/components/recruiter/recommended-candidates"
import { RecentShortlists } from "@/components/recruiter/recent-shortlists"
import { HiringPipeline } from "@/components/recruiter/hiring-pipeline"
import type { RecruiterProfile } from "@/lib/types"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function RecruiterDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "recruiter") {
    redirect("/login")
  }

  const recruiter = user as RecruiterProfile

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Recruiter Dashboard"
        description={`Welcome back, ${recruiter.name} from ${recruiter.companyName}`}
      />
      <div className="flex-1 space-y-6 p-6">
        <RecruiterStats />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <RecommendedCandidates />
            <HiringPipeline />
          </div>
          <div>
            <RecentShortlists />
          </div>
        </div>
      </div>
    </div>
  )
}
