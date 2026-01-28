import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { PlatformsManager } from "@/components/student/platforms-manager"
import { serializeUser } from "@/lib/serialize"
import type { StudentProfile } from "@/lib/types"

export default async function PlatformsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "student") {
    redirect("/login")
  }

  const student = serializeUser(user) as StudentProfile

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <DashboardHeader
        title="Platforms"
        description="Manage your connected coding platforms"
      />
      <div className="flex-1 p-6">
        <PlatformsManager student={student} />
      </div>
    </div>
  )
}
