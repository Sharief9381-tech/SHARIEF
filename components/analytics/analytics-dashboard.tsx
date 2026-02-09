"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  Eye, 
  UserPlus, 
  LogIn, 
  RefreshCw,
  TrendingUp,
  Clock,
  Globe,
  GraduationCap,
  Building,
  Target,
  Award,
  Briefcase,
  PieChart,
  LineChart,
  Calendar,
  Filter
} from "lucide-react"

interface CollegeAnalyticsData {
  summary: {
    totalEvents: number
    uniqueVisitors: number
    pageViews: number
    signups: number
    logins: number
  }
  topPages: Array<{ page: string; views: number }>
  roleStats: Record<string, number>
  recentActivity: Array<{
    type: string
    page?: string
    action?: string
    userRole?: string
    timestamp: string
    ip?: string
  }>
  hourlyActivity: Record<string, number>
  timeRange: {
    start: string
    end: string
  } | null
  // College-specific data
  studentMetrics: {
    totalStudents: number
    activeStudents: number
    platformConnections: number
    averageProblems: number
    topPerformers: Array<{
      name: string
      problems: number
      rating: number
      platforms: number
    }>
  }
  placementMetrics: {
    totalApplications: number
    placementRate: number
    averagePackage: number
    topRecruiters: Array<{
      company: string
      hires: number
      package: number
    }>
  }
  departmentBreakdown: Array<{
    department: string
    students: number
    placed: number
    avgPackage: number
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<CollegeAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week')
  const [analyticsMode, setAnalyticsMode] = useState<'website' | 'students' | 'placements' | 'departments'>('website')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, analyticsMode])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}&mode=${analyticsMode}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        console.error('Failed to fetch analytics:', response.status)
        // Use mock data for demo
        setData(getMockCollegeData())
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Use mock data for demo
      setData(getMockCollegeData())
    } finally {
      setLoading(false)
    }
  }

  const formatEventType = (type: string) => {
    switch (type) {
      case 'page_view': return 'Page View'
      case 'user_signup': return 'User Signup'
      case 'user_login': return 'User Login'
      case 'platform_link': return 'Platform Linked'
      default: return type
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view': return <Eye className="h-3 w-3" />
      case 'user_signup': return <UserPlus className="h-3 w-3" />
      case 'user_login': return <LogIn className="h-3 w-3" />
      default: return <Globe className="h-3 w-3" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-500/20 text-blue-500'
      case 'college': return 'bg-green-500/20 text-green-500'
      case 'recruiter': return 'bg-purple-500/20 text-purple-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'website': return <Globe className="h-4 w-4" />
      case 'students': return <Users className="h-4 w-4" />
      case 'placements': return <Briefcase className="h-4 w-4" />
      case 'departments': return <Building className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getModeTitle = (mode: string) => {
    switch (mode) {
      case 'website': return 'Website Analytics'
      case 'students': return 'Student Performance'
      case 'placements': return 'Placement Analytics'
      case 'departments': return 'Department Breakdown'
      default: return 'Analytics'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">College Analytics</h1>
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 w-20 bg-secondary rounded mb-2" />
                <div className="h-8 w-16 bg-secondary rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Failed to load analytics data</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Mode Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {getModeIcon(analyticsMode)}
              {getModeTitle(analyticsMode)} - COLLEGE PORTAL
            </h1>
            <p className="text-muted-foreground">
              College-specific insights and performance metrics
            </p>
            <p className="text-xs text-green-600 font-bold">
              ✅ THIS IS THE COLLEGE ANALYTICS PORTAL ✅
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Analytics Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <Button
              variant={analyticsMode === 'website' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAnalyticsMode('website')}
              className="h-8"
            >
              <Globe className="h-3 w-3 mr-1" />
              Website
            </Button>
            <Button
              variant={analyticsMode === 'students' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAnalyticsMode('students')}
              className="h-8"
            >
              <Users className="h-3 w-3 mr-1" />
              Students
            </Button>
            <Button
              variant={analyticsMode === 'placements' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAnalyticsMode('placements')}
              className="h-8"
            >
              <Briefcase className="h-3 w-3 mr-1" />
              Placements
            </Button>
            <Button
              variant={analyticsMode === 'departments' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAnalyticsMode('departments')}
              className="h-8"
            >
              <Building className="h-3 w-3 mr-1" />
              Departments
            </Button>
          </div>
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mode-Specific Content */}
      {analyticsMode === 'website' && (
        <div className="space-y-6">
          {/* Website Analytics Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-chart-1" />
                  <span className="text-sm font-medium">Total Events</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.summary.totalEvents.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-chart-2" />
                  <span className="text-sm font-medium">Unique Visitors</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.summary.uniqueVisitors.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-chart-3" />
                  <span className="text-sm font-medium">Page Views</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.summary.pageViews.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-chart-4" />
                  <span className="text-sm font-medium">Signups</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.summary.signups.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-chart-5" />
                  <span className="text-sm font-medium">Logins</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.summary.logins.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Website Analytics Details */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topPages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No page views recorded</p>
                ) : (
                  <div className="space-y-3">
                    {data.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{page.page}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(data.roleStats).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No user activity recorded</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(data.roleStats).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <Badge className={getRoleBadgeColor(role)}>
                          {role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{count} events</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {analyticsMode === 'students' && (
        <div className="space-y-6">
          {/* Student Performance Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Total Students</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.studentMetrics.totalStudents}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Active Students</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.studentMetrics.activeStudents}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((data.studentMetrics.activeStudents / data.studentMetrics.totalStudents) * 100)}% engagement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Platform Connections</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.studentMetrics.platformConnections}</p>
                <p className="text-xs text-muted-foreground">
                  Avg {Math.round(data.studentMetrics.platformConnections / data.studentMetrics.totalStudents)} per student
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Avg Problems</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.studentMetrics.averageProblems}</p>
                <p className="text-xs text-muted-foreground">Per student</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.studentMetrics.topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 p-0 justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.platforms} platforms connected
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{student.problems} problems</div>
                      <div className="text-sm text-muted-foreground">Rating: {student.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsMode === 'placements' && (
        <div className="space-y-6">
          {/* Placement Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Total Applications</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.placementMetrics.totalApplications}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Placement Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.placementMetrics.placementRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Average Package</span>
                </div>
                <p className="text-2xl font-bold mt-2">₹{data.placementMetrics.averagePackage}L</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Top Recruiters</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.placementMetrics.topRecruiters.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Recruiters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Top Recruiting Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.placementMetrics.topRecruiters.map((recruiter, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 p-0 justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{recruiter.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {recruiter.hires} hires
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{recruiter.package}L</div>
                      <div className="text-sm text-muted-foreground">Avg package</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsMode === 'departments' && (
        <div className="space-y-6">
          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.departmentBreakdown.map((dept, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{dept.department}</h3>
                      <Badge variant="outline">
                        {Math.round((dept.placed / dept.students) * 100)}% placed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Students</div>
                        <div className="font-bold">{dept.students}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Placed</div>
                        <div className="font-bold text-green-600">{dept.placed}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Package</div>
                        <div className="font-bold">₹{dept.avgPackage}L</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(dept.placed / dept.students) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity (Common to all modes) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    {getEventIcon(activity.type)}
                    <span className="text-sm font-medium">{formatEventType(activity.type)}</span>
                  </div>
                  {activity.page && (
                    <span className="text-sm text-muted-foreground">→ {activity.page}</span>
                  )}
                  {activity.userRole && (
                    <Badge className={getRoleBadgeColor(activity.userRole)} variant="outline">
                      {activity.userRole}
                    </Badge>
                  )}
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    {activity.ip && <span>{activity.ip}</span>}
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data for demonstration
function getMockCollegeData(): CollegeAnalyticsData {
  return {
    summary: {
      totalEvents: 2456,
      uniqueVisitors: 342,
      pageViews: 1876,
      signups: 89,
      logins: 234
    },
    topPages: [
      { page: "/student/dashboard", views: 456 },
      { page: "/student/platforms", views: 234 },
      { page: "/college/students", views: 189 },
      { page: "/student/jobs", views: 156 },
      { page: "/college/analytics", views: 123 }
    ],
    roleStats: {
      student: 1890,
      college: 234,
      recruiter: 332
    },
    recentActivity: [
      {
        type: "user_signup",
        userRole: "student",
        timestamp: "2024-02-01T10:30:00Z",
        ip: "192.168.1.100"
      },
      {
        type: "platform_link",
        action: "leetcode",
        userRole: "student",
        timestamp: "2024-02-01T10:25:00Z",
        ip: "192.168.1.101"
      },
      {
        type: "page_view",
        page: "/college/students",
        userRole: "college",
        timestamp: "2024-02-01T10:20:00Z",
        ip: "192.168.1.102"
      }
    ],
    hourlyActivity: {
      "9": 45,
      "10": 67,
      "11": 89,
      "12": 56,
      "13": 78,
      "14": 92,
      "15": 67,
      "16": 45
    },
    timeRange: {
      start: "2024-01-25T00:00:00Z",
      end: "2024-02-01T23:59:59Z"
    },
    studentMetrics: {
      totalStudents: 1250,
      activeStudents: 892,
      platformConnections: 2340,
      averageProblems: 156,
      topPerformers: [
        { name: "Alex Chen", problems: 450, rating: 2100, platforms: 5 },
        { name: "Priya Sharma", problems: 389, rating: 1950, platforms: 4 },
        { name: "Rahul Kumar", problems: 345, rating: 1800, platforms: 6 },
        { name: "Sarah Wilson", problems: 298, rating: 1750, platforms: 3 },
        { name: "David Lee", problems: 267, rating: 1650, platforms: 4 }
      ]
    },
    placementMetrics: {
      totalApplications: 2340,
      placementRate: 78,
      averagePackage: 12.5,
      topRecruiters: [
        { company: "Google", hires: 45, package: 28 },
        { company: "Microsoft", hires: 38, package: 25 },
        { company: "Amazon", hires: 42, package: 22 },
        { company: "Meta", hires: 29, package: 26 },
        { company: "Apple", hires: 23, package: 24 }
      ]
    },
    departmentBreakdown: [
      { department: "Computer Science", students: 450, placed: 378, avgPackage: 15.2 },
      { department: "Information Technology", students: 320, placed: 256, avgPackage: 12.8 },
      { department: "Electronics & Communication", students: 280, placed: 210, avgPackage: 11.5 },
      { department: "Mechanical Engineering", students: 200, placed: 140, avgPackage: 9.8 }
    ]
  }
}