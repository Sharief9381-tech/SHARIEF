import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { Analytics } from "@/lib/analytics"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    // Only allow admin users
    if (!user || user.email !== "sharief9381@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Gather comprehensive admin data
    const adminData = await gatherAdminData()

    return NextResponse.json({
      success: true,
      data: adminData,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    )
  }
}

async function gatherAdminData() {
  const data = {
    summary: {
      totalUsers: 0,
      activeUsers: 0,
      totalStudents: 0,
      totalColleges: 0,
      totalRecruiters: 0,
      platformConnections: 0,
      totalProblems: 0,
      jobApplications: 0
    },
    recentActivity: [] as any[],
    platformHealth: [] as any[],
    userGrowth: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    systemMetrics: {
      cpuUsage: Math.floor(Math.random() * 50) + 20, // Mock system metrics
      memoryUsage: Math.floor(Math.random() * 40) + 30,
      diskUsage: Math.floor(Math.random() * 30) + 10,
      apiCalls: 0,
      errorRate: 0.1
    },
    topPerformers: [] as any[]
  }

  try {
    if (isDatabaseAvailable()) {
      const db = await getDatabase()
      
      // Get user statistics
      const users = await db.collection('users').find({}).toArray()
      data.summary.totalUsers = users.length
      data.summary.totalStudents = users.filter(u => u.role === 'student').length
      data.summary.totalColleges = users.filter(u => u.role === 'college').length
      data.summary.totalRecruiters = users.filter(u => u.role === 'recruiter').length

      // Calculate active users (users with recent activity)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const activeSessions = await db.collection('sessions')
        .find({ lastAccessed: { $gte: last24Hours } })
        .toArray()
      data.summary.activeUsers = activeSessions.length

      // Get platform connections
      const studentsWithPlatforms = users.filter(u => 
        u.role === 'student' && u.linkedPlatforms && Object.keys(u.linkedPlatforms).length > 0
      )
      data.summary.platformConnections = studentsWithPlatforms.reduce((total, student) => {
        return total + Object.keys(student.linkedPlatforms || {}).length
      }, 0)

      // Calculate total problems solved
      data.summary.totalProblems = users
        .filter(u => u.role === 'student' && u.stats)
        .reduce((total, student) => total + (student.stats?.totalProblems || 0), 0)

      // Get top performers
      data.topPerformers = users
        .filter(u => u.role === 'student' && u.stats)
        .sort((a, b) => (b.stats?.totalProblems || 0) - (a.stats?.totalProblems || 0))
        .slice(0, 5)
        .map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          totalProblems: user.stats?.totalProblems || 0,
          rating: user.stats?.rating || 0
        }))

      // Get user growth metrics
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      data.userGrowth.daily = await db.collection('users')
        .countDocuments({ createdAt: { $gte: yesterday } })
      data.userGrowth.weekly = await db.collection('users')
        .countDocuments({ createdAt: { $gte: weekAgo } })
      data.userGrowth.monthly = await db.collection('users')
        .countDocuments({ createdAt: { $gte: monthAgo } })

    } else {
      // Use fallback/mock data when database is not available
      data.summary = {
        totalUsers: 1247,
        activeUsers: 89,
        totalStudents: 1050,
        totalColleges: 45,
        totalRecruiters: 152,
        platformConnections: 3421,
        totalProblems: 45678,
        jobApplications: 234
      }
      
      data.topPerformers = [
        {
          name: "Alex Chen",
          email: "alex.chen@demo.com",
          role: "student",
          totalProblems: 1250,
          rating: 2100
        },
        {
          name: "Priya Sharma",
          email: "priya.sharma@demo.com",
          role: "student",
          totalProblems: 980,
          rating: 1850
        }
      ]

      data.userGrowth = {
        daily: 12,
        weekly: 89,
        monthly: 345
      }
    }

    // Get analytics data
    const analytics = await Analytics.getAnalytics('today')
    data.systemMetrics.apiCalls = analytics.summary.totalEvents

    // Get recent activity from analytics with full user details
    data.recentActivity = analytics.recentActivity.slice(0, 10).map(activity => ({
      type: activity.type,
      user: activity.userRole ? `${activity.userRole} user` : 'Anonymous user',
      action: getActivityDescription(activity.type, activity.page, activity.action),
      timestamp: getRelativeTime(new Date(activity.timestamp)),
      details: activity.metadata || {} // Include all metadata which contains user info
    }))

    // Mock platform health data (in real implementation, this would ping each platform)
    data.platformHealth = [
      {
        platform: "LeetCode",
        status: "healthy",
        connections: Math.floor(data.summary.platformConnections * 0.25),
        lastSync: "2 min ago",
        responseTime: Math.floor(Math.random() * 200) + 150
      },
      {
        platform: "GitHub",
        status: "healthy",
        connections: Math.floor(data.summary.platformConnections * 0.35),
        lastSync: "1 min ago",
        responseTime: Math.floor(Math.random() * 150) + 100
      },
      {
        platform: "Codeforces",
        status: Math.random() > 0.8 ? "degraded" : "healthy",
        connections: Math.floor(data.summary.platformConnections * 0.18),
        lastSync: "3 min ago",
        responseTime: Math.floor(Math.random() * 400) + 200
      },
      {
        platform: "CodeChef",
        status: "healthy",
        connections: Math.floor(data.summary.platformConnections * 0.12),
        lastSync: "5 min ago",
        responseTime: Math.floor(Math.random() * 300) + 200
      },
      {
        platform: "HackerRank",
        status: "healthy",
        connections: Math.floor(data.summary.platformConnections * 0.10),
        lastSync: "4 min ago",
        responseTime: Math.floor(Math.random() * 250) + 180
      }
    ]

  } catch (error) {
    console.error('Error gathering admin data:', error)
  }

  return data
}

function getActivityDescription(type: string, page?: string, action?: string): string {
  switch (type) {
    case 'page_view':
      return `viewed ${page || 'a page'}`
    case 'user_signup':
      return 'signed up'
    case 'user_login':
      return 'logged in'
    case 'platform_link':
      return `connected ${action || 'a platform'}`
    default:
      return action || 'performed an action'
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}