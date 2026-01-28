import { DashboardHeader } from "@/components/dashboard/header"
import { JobMatches } from "@/components/student/job-matches"

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <DashboardHeader
        title="AI Job Matches"
        description="Personalized job recommendations based on your skills and coding performance"
      />
      <div className="flex-1 p-6">
        <JobMatches />
      </div>
    </div>
  )
}
