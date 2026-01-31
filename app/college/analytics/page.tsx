import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { BatchAnalytics } from "@/components/college/batch-analytics"
import { serializeUser } from "@/lib/serialize"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "college") {
    redirect("/login")
  }

  const college = serializeUser(user)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="College Analytics"
        description={`Performance analytics for ${(college as any).collegeName || 'your college'} students`}
      />
      <div className="flex-1 p-6">
        <BatchAnalytics college={college} />
      </div>
    </div>
  )
}