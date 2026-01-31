import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { Analytics } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    
    // Only allow admin users or college users to view analytics
    if (!user || (user.role !== "college" && user.email !== "admin@codetrack.com")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') as 'today' | 'week' | 'month' | 'all' || 'week'

    const analytics = await Analytics.getAnalytics(timeRange)

    return NextResponse.json({
      success: true,
      data: analytics,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, page, action, metadata } = body

    // Get visitor info from request headers
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get current user if available
    const user = await getCurrentUser()

    await Analytics.track({
      type,
      page,
      action,
      metadata,
      userId: user?._id?.toString(),
      userRole: user?.role,
    }, {
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    )
  }
}