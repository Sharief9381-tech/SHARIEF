import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { TalentSearch } from "@/components/recruiter/talent-search"
import { Suspense } from "react"
import Loading from "./loading"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "recruiter") {
    redirect("/login")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Search Talent"
        description="Find the perfect candidates with AI-powered search"
      />
      <div className="flex-1 p-6">
        <Suspense fallback={<Loading />}>
          <TalentSearch />
        </Suspense>
      </div>
    </div>
  )
}
