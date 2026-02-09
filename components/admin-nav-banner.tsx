"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminNavBanner() {
  const router = useRouter()

  return (
    <div className="bg-red-50 border-b border-red-200 p-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-700">
            🔴 ADMIN USER: You're viewing the College Portal
          </span>
        </div>
        <Button 
          onClick={() => router.push('/admin')}
          size="sm"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Switch to Admin Portal
        </Button>
      </div>
    </div>
  )
}