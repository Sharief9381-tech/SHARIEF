"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Users, 
  Eye, 
  UserPlus, 
  LogIn, 
  RefreshCw,
  Globe,
  Clock,
  TrendingUp
} from "lucide-react"

interface AnalyticsData {
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
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        console.error('Failed to fetch analytics:', response.status)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Website Analytics</h1>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Analytics</h1>
          <p className="text-muted-foreground">
            Monitor visitor activity and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Summary Cards */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
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

        {/* User Roles */}
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

      {/* Recent Activity */}
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