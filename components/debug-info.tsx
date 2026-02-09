"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DebugInfo() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return null

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 border-red-200 bg-red-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-700">🐛 Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Current URL:</strong> {pathname}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || "Not logged in"}
        </div>
        <div>
          <strong>User Role:</strong> {user?.role || "N/A"}
        </div>
        <div>
          <strong>Is Admin:</strong> 
          <Badge variant={user?.email === "sharief9381@gmail.com" ? "destructive" : "secondary"} className="ml-2">
            {user?.email === "sharief9381@gmail.com" ? "YES" : "NO"}
          </Badge>
        </div>
        <div className="pt-2 border-t text-red-600">
          <strong>Expected:</strong> Admin should be at /admin with red dashboard
        </div>
      </CardContent>
    </Card>
  )
}