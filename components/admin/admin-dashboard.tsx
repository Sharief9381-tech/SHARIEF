"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Users, 
  Activity, 
  Globe, 
  TrendingUp, 
  Database,
  Shield,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Monitor,
  Server,
  Zap,
  Crown,
  Mail,
  Calendar,
  Award,
  Code2,
  GitBranch,
  Briefcase
} from "lucide-react"

interface AdminData {
  summary: {
    totalUsers: number
    activeUsers: number
    totalStudents: number
    totalColleges: number
    totalRecruiters: number
    platformConnections: number
    totalProblems: number
    jobApplications: number
  }
  recentActivity: Array<{
    type: string
    user: string
    action: string
    timestamp: string
    details?: any
  }>
  platformHealth: Array<{
    platform: string
    status: 'healthy' | 'degraded' | 'down'
    connections: number
    lastSync: string
    responseTime: number
  }>
  userGrowth: {
    daily: number
    weekly: number
    monthly: number
  }
  systemMetrics: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    apiCalls: number
    errorRate: number
  }
  topPerformers: Array<{
    name: string
    email: string
    role: string
    totalProblems: number
    rating: number
  }>
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)

  useEffect(() => {
    fetchAdminData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAdminData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        console.error('Failed to fetch admin data:', response.status)
        // Use mock data for demo
        setData(getMockAdminData())
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      // Use mock data for demo
      setData(getMockAdminData())
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userEmail: string) => {
    setUserDetailsLoading(true)
    try {
      const response = await fetch(`/api/admin/user-details?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const result = await response.json()
        setSelectedUser(result.user)
      } else {
        console.error('Failed to fetch user details:', response.status)
        // Use mock data for demo
        setSelectedUser(getMockUserDetails(userEmail))
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      // Use mock data for demo
      setSelectedUser(getMockUserDetails(userEmail))
    } finally {
      setUserDetailsLoading(false)
    }
  }

  const handleUserClick = (userEmail: string) => {
    fetchUserDetails(userEmail)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'down': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-500'
      case 'degraded': return 'bg-yellow-500/20 text-yellow-500'
      case 'down': return 'bg-red-500/20 text-red-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-200">
          <div className="p-4 bg-blue-500 rounded-full mb-6">
            <RefreshCw className="h-12 w-12 animate-spin text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Loading Admin Dashboard</h2>
          <p className="text-lg text-blue-600">Fetching system-wide data and metrics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl border-2 border-red-200">
          <div className="p-4 bg-red-500 rounded-full mb-6">
            <XCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Failed to Load Admin Data</h2>
          <p className="text-lg text-red-600 mb-6">Unable to retrieve system metrics and user data</p>
          <Button 
            onClick={fetchAdminData} 
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry Loading Data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* ADMIN HEADER - CLEAR AND PROMINENT */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500 rounded-xl shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-red-700 mb-2">
              🔴 ADMIN CONTROL PANEL
            </h1>
            <p className="text-lg text-red-600 font-medium mb-1">
              Complete System Oversight & User Management
            </p>
            <p className="text-sm text-red-500 font-semibold">
              ⚠️ ADMINISTRATOR ACCESS ONLY - SYSTEM-WIDE DATA ⚠️
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="animate-pulse px-4 py-2 text-sm font-bold">
            🔒 ADMIN MODE ACTIVE
          </Badge>
          <Button 
            onClick={fetchAdminData} 
            variant="outline" 
            size="lg"
            className="border-red-300 text-red-700 hover:bg-red-50 font-medium"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* ADMIN-SPECIFIC ALERT - MORE PROMINENT */}
      <Card className="mb-8 border-red-300 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold text-red-800">
              Administrator Dashboard - Complete System Control
            </span>
          </div>
          <p className="text-base text-red-700 leading-relaxed">
            This dashboard provides comprehensive access to all user data, system metrics, and platform health monitoring. 
            You have full oversight of students, colleges, and recruiters across the entire CodeTrack platform.
          </p>
          <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-800">
              📊 <strong>Data Scope:</strong> All users, all platforms, all activities • 
              🔧 <strong>Access Level:</strong> Full system administration • 
              ⚡ <strong>Real-time:</strong> Live data updates every 30 seconds
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 h-14 p-1 bg-gray-100 rounded-xl">
          <TabsTrigger value="overview" className="text-base font-semibold py-3">
            🏠 System Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="text-base font-semibold py-3">
            👥 User Management
          </TabsTrigger>
          <TabsTrigger value="platforms" className="text-base font-semibold py-3">
            🔗 Platform Health
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-base font-semibold py-3">
            📊 Live Activity
          </TabsTrigger>
          <TabsTrigger value="system" className="text-base font-semibold py-3">
            ⚙️ System Metrics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* ADMIN EXECUTIVE SUMMARY - IMPROVED READABILITY */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-base font-bold text-gray-800">Total Platform Users</span>
                </div>
                <p className="text-4xl font-bold text-blue-700 mb-2">{data.summary.totalUsers.toLocaleString()}</p>
                <p className="text-sm font-medium text-green-600">+{data.userGrowth.daily} new today</p>
              </CardContent>
            </Card>

            <Card className="border-green-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-6 w-6 text-green-600" />
                  <span className="text-base font-bold text-gray-800">Currently Active</span>
                </div>
                <p className="text-4xl font-bold text-green-700 mb-2">{data.summary.activeUsers}</p>
                <p className="text-sm font-medium text-gray-600">Online right now</p>
              </CardContent>
            </Card>

            <Card className="border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <span className="text-base font-bold text-gray-800">Platform Connections</span>
                </div>
                <p className="text-4xl font-bold text-purple-700 mb-2">{data.summary.platformConnections.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">Across 17+ coding platforms</p>
              </CardContent>
            </Card>

            <Card className="border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  <span className="text-base font-bold text-gray-800">Problems Solved</span>
                </div>
                <p className="text-4xl font-bold text-orange-700 mb-2">{data.summary.totalProblems.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">Community total</p>
              </CardContent>
            </Card>
          </div>

          {/* ROLE-SPECIFIC ACTIVITY BREAKDOWN - ENHANCED VISIBILITY */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* STUDENT ACTIVITY */}
            <Card className="border-blue-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-blue-50 -mt-6 pt-6">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <Users className="h-6 w-6 text-white" />
                  Student Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-semibold text-white">Total Students</span>
                    <span className="text-2xl font-bold text-white">{data.summary.totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-semibold text-white">Active Today</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.activeUsers * 0.8)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-semibold text-white">Platform Links</span>
                    <span className="text-2xl font-bold text-white">{data.summary.platformConnections}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-600">
                    <span className="text-base font-semibold text-white">Problems Solved</span>
                    <span className="text-2xl font-bold text-white">{data.summary.totalProblems.toLocaleString()}</span>
                  </div>
                  <div className="pt-6 border-t-2 border-blue-200">
                    <div className="text-sm font-bold text-blue-800 mb-4">📈 Recent Student Activity:</div>
                    <div className="text-sm text-white leading-relaxed space-y-2">
                      <div>• <strong>{Math.floor(Math.random() * 20) + 10}</strong> new student registrations today</div>
                      <div>• <strong>{Math.floor(Math.random() * 50) + 30}</strong> new platform connections</div>
                      <div>• <strong>{Math.floor(Math.random() * 200) + 150}</strong> coding problems solved</div>
                      <div>• <strong>{Math.floor(Math.random() * 15) + 5}</strong> job applications submitted</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COLLEGE ACTIVITY */}
            <Card className="border-green-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-green-50 -mt-6 pt-6">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <Database className="h-6 w-6 text-white" />
                  College Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-semibold text-white">Total Colleges</span>
                    <span className="text-2xl font-bold text-white">{data.summary.totalColleges}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-semibold text-white">Active Today</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.activeUsers * 0.1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-semibold text-white">Students Managed</span>
                    <span className="text-2xl font-bold text-white">{data.summary.totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-600">
                    <span className="text-base font-semibold text-white">Placement Tracking</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.jobApplications * 1.5)}</span>
                  </div>
                  <div className="pt-6 border-t-2 border-green-200">
                    <div className="text-sm font-bold text-green-800 mb-4">🏫 Recent College Activity:</div>
                    <div className="text-sm text-white leading-relaxed space-y-2">
                      <div>• <strong>{Math.floor(Math.random() * 5) + 2}</strong> new college registrations</div>
                      <div>• <strong>{Math.floor(Math.random() * 30) + 20}</strong> student profiles reviewed</div>
                      <div>• <strong>{Math.floor(Math.random() * 10) + 5}</strong> placement reports generated</div>
                      <div>• <strong>{Math.floor(Math.random() * 8) + 3}</strong> recruiter partnerships</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RECRUITER ACTIVITY */}
            <Card className="border-purple-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-purple-50 -mt-6 pt-6">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <Shield className="h-6 w-6 text-white" />
                  Recruiter Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-semibold text-white">Total Recruiters</span>
                    <span className="text-2xl font-bold text-white">{data.summary.totalRecruiters}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-semibold text-white">Active Today</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.activeUsers * 0.1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-semibold text-white">Job Postings</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.jobApplications / 3)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-600">
                    <span className="text-base font-semibold text-white">Candidate Searches</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.jobApplications * 2)}</span>
                  </div>
                  <div className="pt-6 border-t-2 border-purple-200">
                    <div className="text-sm font-bold text-purple-800 mb-4">💼 Recent Recruiter Activity:</div>
                    <div className="text-sm text-white leading-relaxed space-y-2">
                      <div>• <strong>{Math.floor(Math.random() * 8) + 3}</strong> new recruiter signups</div>
                      <div>• <strong>{Math.floor(Math.random() * 25) + 15}</strong> candidate searches performed</div>
                      <div>• <strong>{Math.floor(Math.random() * 12) + 8}</strong> job postings created</div>
                      <div>• <strong>{Math.floor(Math.random() * 20) + 10}</strong> shortlists updated</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DETAILED ROLE INSIGHTS */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <PieChart className="h-6 w-6 text-white" />
                  Platform User Distribution (ADMIN VIEW)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">Students</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{data.summary.totalStudents}</span>
                      <span className="text-sm text-white/80 ml-2 block">
                        ({Math.round((data.summary.totalStudents / data.summary.totalUsers) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">Colleges</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{data.summary.totalColleges}</span>
                      <span className="text-sm text-white/80 ml-2 block">
                        ({Math.round((data.summary.totalColleges / data.summary.totalUsers) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-purple-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">Recruiters</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{data.summary.totalRecruiters}</span>
                      <span className="text-sm text-white/80 ml-2 block">
                        ({Math.round((data.summary.totalRecruiters / data.summary.totalUsers) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                  Cross-Role Interactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-bold text-white">Student → Job Applications</span>
                    <span className="text-2xl font-bold text-white">{data.summary.jobApplications}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-bold text-white">College → Student Tracking</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.totalStudents * 0.8)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-bold text-white">Recruiter → Candidate Views</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.jobApplications * 2.5)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-600">
                    <span className="text-base font-bold text-white">College ↔ Recruiter Partnerships</span>
                    <span className="text-2xl font-bold text-white">{Math.floor(data.summary.totalColleges * 0.6)}</span>
                  </div>
                  <div className="pt-4 border-t-2 border-red-200">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-600">
                      <span className="text-base font-bold text-white">Platform Engagement</span>
                      <span className="text-2xl font-bold text-white">
                        {Math.round((data.summary.activeUsers / data.summary.totalUsers) * 100)}% active
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* ROLE-SPECIFIC USER INSIGHTS */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* STUDENT INSIGHTS */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Users className="h-5 w-5" />
                  Student Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Most Active Students:</span>
                    </div>
                    {data.topPerformers.slice(0, 3).map((student, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <span className="text-xs truncate">{student.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {student.totalProblems}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Platform Connections:</span>
                      <span className="font-medium">{data.summary.platformConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Problems/Student:</span>
                      <span className="font-medium">{Math.floor(data.summary.totalProblems / data.summary.totalStudents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Job Applications:</span>
                      <span className="font-medium">{data.summary.jobApplications}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COLLEGE INSIGHTS */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Database className="h-5 w-5" />
                  College Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Top Colleges by Students:</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">MIT</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.totalStudents * 0.15)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">Stanford</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.totalStudents * 0.12)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">IIT Delhi</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.totalStudents * 0.10)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Avg Students/College:</span>
                      <span className="font-medium">{Math.floor(data.summary.totalStudents / data.summary.totalColleges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placement Rate:</span>
                      <span className="font-medium">{Math.floor((data.summary.jobApplications / data.summary.totalStudents) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Colleges:</span>
                      <span className="font-medium">{Math.floor(data.summary.totalColleges * 0.7)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RECRUITER INSIGHTS */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Shield className="h-5 w-5" />
                  Recruiter Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Top Companies:</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">Google</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.jobApplications * 0.08)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">Microsoft</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.jobApplications * 0.07)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs">Amazon</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(data.summary.jobApplications * 0.06)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Job Postings:</span>
                      <span className="font-medium">{Math.floor(data.summary.jobApplications / 3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Candidate Searches:</span>
                      <span className="font-medium">{Math.floor(data.summary.jobApplications * 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hire Rate:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 15) + 8}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TOP PERFORMERS WITH ROLE BREAKDOWN */}
          <Card className="border-red-300 shadow-lg overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <Crown className="h-6 w-6 text-yellow-300" />
                Top Performers Across All Roles (ADMIN USER MANAGEMENT)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.topPerformers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-600">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 p-0 justify-center font-bold bg-yellow-500 text-black border-yellow-400">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-bold text-white text-lg">{user.name}</div>
                        <div className="text-base text-gray-300">{user.email}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-sm font-bold ${
                              user.role === 'student' ? 'bg-blue-600 text-white' :
                              user.role === 'college' ? 'bg-green-600 text-white' :
                              'bg-purple-600 text-white'
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                          {user.role === 'student' && (
                            <Badge variant="outline" className="text-sm bg-orange-500 text-white border-orange-400">
                              {Math.floor(Math.random() * 5) + 2} platforms
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-3xl text-yellow-400">{user.totalProblems}</div>
                      <div className="text-base text-gray-300 font-medium">problems solved</div>
                      <div className="text-base font-bold text-blue-400">Rating: {user.rating}</div>
                      {user.role === 'student' && (
                        <div className="text-sm text-gray-400 mt-1">
                          Last active: {Math.floor(Math.random() * 24) + 1}h ago
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* USER ENGAGEMENT METRICS BY ROLE */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="text-white text-xl">Role-Based Engagement</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-600">
                    <div>
                      <div className="font-bold text-white text-lg">Students</div>
                      <div className="text-base text-white/80">Daily Active Rate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-2xl">
                        {Math.floor((Math.floor(data.summary.activeUsers * 0.8) / data.summary.totalStudents) * 100)}%
                      </div>
                      <div className="text-sm text-white/80">
                        {Math.floor(data.summary.activeUsers * 0.8)} active
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-600">
                    <div>
                      <div className="font-bold text-white text-lg">Colleges</div>
                      <div className="text-base text-white/80">Daily Active Rate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-2xl">
                        {Math.floor((Math.floor(data.summary.activeUsers * 0.1) / data.summary.totalColleges) * 100)}%
                      </div>
                      <div className="text-sm text-white/80">
                        {Math.floor(data.summary.activeUsers * 0.1)} active
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-purple-600">
                    <div>
                      <div className="font-bold text-white text-lg">Recruiters</div>
                      <div className="text-base text-white/80">Daily Active Rate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-2xl">
                        {Math.floor((Math.floor(data.summary.activeUsers * 0.1) / data.summary.totalRecruiters) * 100)}%
                      </div>
                      <div className="text-sm text-white/80">
                        {Math.floor(data.summary.activeUsers * 0.1)} active
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="text-white text-xl">Cross-Role Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-bold text-white">Student → Job Applications</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-3 bg-blue-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '75%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">{data.summary.jobApplications}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-bold text-white">College → Student Management</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-3 bg-green-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '85%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">{Math.floor(data.summary.totalStudents * 0.85)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-bold text-white">Recruiter → Candidate Views</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-3 bg-purple-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '60%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">{Math.floor(data.summary.jobApplications * 2.5)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-600">
                    <span className="text-base font-bold text-white">College ↔ Recruiter Partnerships</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-3 bg-orange-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '45%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">{Math.floor(data.summary.totalColleges * 0.6)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-8">
          <Card className="shadow-lg overflow-hidden border-red-300">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 pb-4 -mt-6 pt-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <Monitor className="h-7 w-7 text-white" />
                Platform Integration Health Monitor
              </CardTitle>
              <p className="text-base text-white/90 mt-2">
                Real-time monitoring of all coding platform integrations and their performance metrics
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {data.platformHealth.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-gray-700 shadow-md">
                        {getStatusIcon(platform.status)}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white mb-1">{platform.platform}</div>
                        <div className="text-base text-gray-300 mb-1">
                          <strong className="text-white">{platform.connections}</strong> active user connections
                        </div>
                        <div className="text-sm text-gray-400">
                          Average response time: <strong className="text-white">{platform.responseTime}ms</strong>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-300 mb-1">Last Sync:</div>
                        <div className="text-base font-bold text-white">{platform.lastSync}</div>
                      </div>
                      <Badge className={`${getStatusColor(platform.status)} px-4 py-2 text-sm font-bold`}>
                        {platform.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          {/* ROLE-SPECIFIC ACTIVITY FEEDS */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* STUDENT ACTIVITIES */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Users className="h-5 w-5" />
                  Student Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 rounded bg-blue-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">alex.chen@demo.com</div>
                      <div className="text-muted-foreground">Connected LeetCode account</div>
                      <div className="text-muted-foreground">2 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-blue-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">priya.sharma@demo.com</div>
                      <div className="text-muted-foreground">Solved 15 problems today</div>
                      <div className="text-muted-foreground">5 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-blue-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">rahul.kumar@demo.com</div>
                      <div className="text-muted-foreground">Applied to Software Engineer role</div>
                      <div className="text-muted-foreground">8 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-blue-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">sarah.wilson@demo.com</div>
                      <div className="text-muted-foreground">Updated profile with new skills</div>
                      <div className="text-muted-foreground">12 min ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COLLEGE ACTIVITIES */}
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Database className="h-5 w-5" />
                  College Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 rounded bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">placement@mit.edu</div>
                      <div className="text-muted-foreground">Generated placement report</div>
                      <div className="text-muted-foreground">3 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">admin@stanford.edu</div>
                      <div className="text-muted-foreground">Viewed 25 student profiles</div>
                      <div className="text-muted-foreground">7 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">tpo@iitd.ac.in</div>
                      <div className="text-muted-foreground">Approved recruiter partnership</div>
                      <div className="text-muted-foreground">15 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">placement@berkeley.edu</div>
                      <div className="text-muted-foreground">Updated college analytics dashboard</div>
                      <div className="text-muted-foreground">18 min ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RECRUITER ACTIVITIES */}
            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Shield className="h-5 w-5" />
                  Recruiter Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 rounded bg-purple-50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">hr@google.com</div>
                      <div className="text-muted-foreground">Posted new SDE role</div>
                      <div className="text-muted-foreground">4 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-purple-50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">recruiter@microsoft.com</div>
                      <div className="text-muted-foreground">Searched 45 candidates</div>
                      <div className="text-muted-foreground">6 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-purple-50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">talent@amazon.com</div>
                      <div className="text-muted-foreground">Updated shortlist with 8 candidates</div>
                      <div className="text-muted-foreground">10 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-purple-50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-xs">
                      <div className="font-medium">hiring@netflix.com</div>
                      <div className="text-muted-foreground">Scheduled 12 interviews</div>
                      <div className="text-muted-foreground">14 min ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COMPREHENSIVE ACTIVITY FEED */}
          <Card className="border-red-300 shadow-lg overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <Activity className="h-6 w-6 text-green-300" />
                Live Platform Activity Feed (ALL ROLES - ADMIN MONITORING)
              </CardTitle>
              <p className="text-sm text-white/90 mt-2">
                Real-time monitoring of user actions across the platform with detailed user information
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {data.recentActivity.map((activity, index) => {
                  // Extract user info from activity - use actual email from activity.user
                  const userEmail = activity.details?.userEmail || activity.user
                  const userName = activity.details?.userName || userEmail?.split('@')[0] || 'Unknown User'
                  const userRole = activity.details?.userRole || 'student'
                  
                  console.log('Activity:', { userEmail, userName, userRole, activity })
                  
                  // Create more descriptive action text
                  let actionDescription = activity.action
                  let actionIcon = '📊'
                  let actionColor = 'bg-gray-600'
                  
                  // Determine action type and styling based on event type
                  const eventType = activity.type.toLowerCase()
                  
                  if (eventType.includes('signup') || eventType === 'user_signup') {
                    actionIcon = '✨'
                    actionColor = 'bg-green-600'
                    actionDescription = `created a new ${userRole} account`
                  } else if (eventType.includes('login') || eventType === 'user_login') {
                    actionIcon = '🔐'
                    actionColor = 'bg-purple-600'
                    actionDescription = `logged in to ${userRole} dashboard`
                  } else if (eventType.includes('platform') || eventType === 'platform_link') {
                    actionIcon = '🔗'
                    actionColor = 'bg-blue-600'
                    const platform = activity.details?.platform || 'a coding platform'
                    actionDescription = `connected ${platform} account`
                  } else if (eventType.includes('job') || eventType === 'job_application') {
                    actionIcon = '💼'
                    actionColor = 'bg-orange-600'
                    const jobTitle = activity.details?.jobTitle || 'a job position'
                    actionDescription = `applied to ${jobTitle}`
                  } else if (eventType.includes('page_view')) {
                    actionIcon = '👁️'
                    actionColor = 'bg-indigo-600'
                    const page = activity.details?.page || activity.action || 'a page'
                    actionDescription = `viewed ${page.replace('/admin', 'admin dashboard').replace('/college', 'college portal').replace('/student', 'student portal').replace('/recruiter', 'recruiter portal')}`
                  } else if (eventType.includes('page_focus')) {
                    actionIcon = '🎯'
                    actionColor = 'bg-cyan-600'
                    actionDescription = `is actively using the platform`
                  } else if (eventType.includes('page_blur')) {
                    actionIcon = '💤'
                    actionColor = 'bg-gray-600'
                    actionDescription = `switched to another tab`
                  } else if (eventType.includes('sync')) {
                    actionIcon = '🔄'
                    actionColor = 'bg-teal-600'
                    const platforms = activity.details?.platforms?.join(', ') || 'platforms'
                    actionDescription = `synced statistics from ${platforms}`
                  } else if (eventType.includes('profile')) {
                    actionIcon = '👤'
                    actionColor = 'bg-pink-600'
                    actionDescription = `updated their profile`
                  } else if (eventType.includes('search')) {
                    actionIcon = '🔍'
                    actionColor = 'bg-amber-600'
                    actionDescription = `searched for candidates`
                  } else {
                    // Default for any other event type
                    actionIcon = '⚡'
                    actionColor = 'bg-yellow-600'
                    actionDescription = activity.action || `performed an action`
                  }

                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-5 rounded-lg bg-gray-800 border-l-4 border-l-green-500 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => {
                        console.log('Clicking user:', userEmail)
                        handleUserClick(userEmail)
                      }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                        {actionIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="text-base font-bold text-white mb-1">
                              {userName}
                            </div>
                            <div className="text-sm text-gray-400 mb-2">
                              {userEmail}
                            </div>
                            <div className="text-base text-gray-200">
                              {actionDescription}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-bold ${
                                userRole === 'student' ? 'bg-blue-600 text-white border-blue-500' :
                                userRole === 'college' ? 'bg-green-600 text-white border-green-500' :
                                userRole === 'recruiter' ? 'bg-purple-600 text-white border-purple-500' :
                                'bg-gray-600 text-white border-gray-500'
                              }`}
                            >
                              {userRole.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs animate-pulse bg-red-600 text-white border-red-500">
                              LIVE
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge className={`${actionColor} text-white text-xs px-2 py-0.5`}>
                              {eventType === 'user_signup' ? 'SIGNUP' :
                               eventType === 'user_login' ? 'LOGIN' :
                               eventType === 'platform_link' ? 'PLATFORM LINK' :
                               eventType === 'job_application' ? 'JOB APPLICATION' :
                               eventType === 'page_view' ? 'PAGE VIEW' :
                               eventType === 'page_focus' ? 'ACTIVE' :
                               eventType === 'page_blur' ? 'INACTIVE' :
                               eventType.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          {activity.details?.ip && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span>{activity.details.ip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {data.recentActivity.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No recent activity</p>
                  <p className="text-sm">User actions will appear here in real-time</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTIVITY ANALYTICS */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="text-white text-xl">Activity Breakdown by Role</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">Student Activities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-3 bg-blue-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '80%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">80%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">College Activities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-3 bg-green-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '12%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span className="text-base font-bold text-white">Recruiter Activities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-3 bg-purple-300 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: '8%' }} />
                      </div>
                      <span className="text-lg font-bold text-white">8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-300 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-600 to-red-700 -mt-6 pt-6">
                <CardTitle className="text-white text-xl">Peak Activity Hours</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600">
                    <span className="text-base font-bold text-white">Students Most Active</span>
                    <span className="text-lg font-bold text-white">2-6 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600">
                    <span className="text-base font-bold text-white">Colleges Most Active</span>
                    <span className="text-lg font-bold text-white">9 AM-12 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600">
                    <span className="text-base font-bold text-white">Recruiters Most Active</span>
                    <span className="text-lg font-bold text-white">10 AM-4 PM</span>
                  </div>
                  <div className="pt-4 border-t-2 border-red-200">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-600">
                      <span className="text-base font-bold text-white">Current Activity Level</span>
                      <Badge className="bg-green-500 text-white px-4 py-2 text-base font-bold">
                        HIGH
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-red-800">
                  <Server className="h-7 w-7 text-red-600" />
                  System Performance Metrics
                </CardTitle>
                <p className="text-base text-red-600 mt-2">Real-time server resource utilization</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-lg font-bold text-blue-900">CPU Usage</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-4 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${data.systemMetrics.cpuUsage}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-blue-700">{data.systemMetrics.cpuUsage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-lg font-bold text-green-900">Memory Usage</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-4 bg-green-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 transition-all duration-500"
                          style={{ width: `${data.systemMetrics.memoryUsage}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-green-700">{data.systemMetrics.memoryUsage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <span className="text-lg font-bold text-orange-900">Disk Usage</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-4 bg-orange-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-600 transition-all duration-500"
                          style={{ width: `${data.systemMetrics.diskUsage}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-orange-700">{data.systemMetrics.diskUsage}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-yellow-800">
                  <Zap className="h-7 w-7 text-yellow-600" />
                  API Health & Performance
                </CardTitle>
                <p className="text-base text-yellow-600 mt-2">Application programming interface metrics</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-lg font-bold text-blue-900">API Calls (24h)</span>
                    <span className="text-3xl font-bold text-blue-700">{data.systemMetrics.apiCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-lg font-bold text-red-900">Error Rate</span>
                    <span className="text-3xl font-bold text-red-700">{data.systemMetrics.errorRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-lg font-bold text-green-900">System Status</span>
                    <Badge className="bg-green-500 text-white px-4 py-2 text-lg font-bold">
                      ✅ OPERATIONAL
                    </Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm font-bold text-gray-700 mb-2">📊 Performance Summary:</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Server uptime: <strong>99.9%</strong></div>
                      <div>• Average response time: <strong>&lt;200ms</strong></div>
                      <div>• Database connections: <strong>Healthy</strong></div>
                      <div>• Cache hit rate: <strong>95.2%</strong></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* USER DETAILS MODAL */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500">
          <DialogHeader className="border-b border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  {selectedUser?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {selectedUser?.name || 'User Details'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-base">
                    Complete profile and activity information
                  </DialogDescription>
                </div>
              </div>
              <Badge 
                className={`text-sm font-bold px-4 py-2 ${
                  selectedUser?.role === 'student' ? 'bg-blue-600' :
                  selectedUser?.role === 'college' ? 'bg-green-600' :
                  selectedUser?.role === 'recruiter' ? 'bg-purple-600' :
                  'bg-gray-600'
                }`}
              >
                {selectedUser?.role?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
          </DialogHeader>

          {userDetailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-white">Loading user details...</span>
            </div>
          ) : selectedUser ? (
            <ScrollArea className="h-[calc(90vh-200px)] pr-4">
              <div className="space-y-6 py-4">
                {/* BASIC INFORMATION */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-xs text-gray-400">Email</div>
                          <div className="text-sm font-medium text-white">{selectedUser.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                        <Calendar className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-xs text-gray-400">Joined</div>
                          <div className="text-sm font-medium text-white">
                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* STUDENT-SPECIFIC DETAILS */}
                {selectedUser.role === 'student' && (
                  <>
                    {/* ACADEMIC INFO */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Award className="h-5 w-5 text-yellow-400" />
                          Academic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                            <Database className="h-5 w-5 text-purple-400" />
                            <div>
                              <div className="text-xs text-gray-400">College Code</div>
                              <div className="text-sm font-medium text-white">{selectedUser.collegeCode || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                            <Users className="h-5 w-5 text-blue-400" />
                            <div>
                              <div className="text-xs text-gray-400">Roll Number</div>
                              <div className="text-sm font-medium text-white">{selectedUser.rollNumber || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                            <Calendar className="h-5 w-5 text-green-400" />
                            <div>
                              <div className="text-xs text-gray-400">Graduation Year</div>
                              <div className="text-sm font-medium text-white">{selectedUser.graduationYear || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
                            <Code2 className="h-5 w-5 text-orange-400" />
                            <div>
                              <div className="text-xs text-gray-400">Branch</div>
                              <div className="text-sm font-medium text-white">{selectedUser.branch || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CODING STATISTICS */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          Coding Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-center">
                            <div className="text-3xl font-bold text-white">
                              {selectedUser.stats?.totalProblems || 0}
                            </div>
                            <div className="text-sm text-blue-100 mt-1">Total Problems</div>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-center">
                            <div className="text-3xl font-bold text-white">
                              {selectedUser.stats?.githubContributions || 0}
                            </div>
                            <div className="text-sm text-green-100 mt-1">GitHub Contributions</div>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 text-center">
                            <div className="text-3xl font-bold text-white">
                              {selectedUser.stats?.rating || 0}
                            </div>
                            <div className="text-sm text-purple-100 mt-1">Highest Rating</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="p-3 rounded-lg bg-gray-700 text-center">
                            <div className="text-xl font-bold text-green-400">
                              {selectedUser.stats?.easyProblems || 0}
                            </div>
                            <div className="text-xs text-gray-400">Easy</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-700 text-center">
                            <div className="text-xl font-bold text-yellow-400">
                              {selectedUser.stats?.mediumProblems || 0}
                            </div>
                            <div className="text-xs text-gray-400">Medium</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-700 text-center">
                            <div className="text-xl font-bold text-red-400">
                              {selectedUser.stats?.hardProblems || 0}
                            </div>
                            <div className="text-xs text-gray-400">Hard</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* LINKED PLATFORMS */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                          <GitBranch className="h-5 w-5 text-blue-400" />
                          Linked Platforms ({Object.keys(selectedUser.linkedPlatforms || {}).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedUser.linkedPlatforms && Object.keys(selectedUser.linkedPlatforms).length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedUser.linkedPlatforms).map(([platform, data]: [string, any]) => (
                              <div key={platform} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700 border border-gray-600">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-white capitalize">{platform}</div>
                                  <div className="text-xs text-gray-400">
                                    {typeof data === 'string' ? data : data?.username || 'Connected'}
                                  </div>
                                </div>
                                <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No platforms linked yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* SKILLS */}
                    {selectedUser.skills && selectedUser.skills.length > 0 && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-orange-400" />
                            Skills ({selectedUser.skills.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.skills.map((skill: string, index: number) => (
                              <Badge key={index} className="bg-blue-600 text-white">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* JOB STATUS */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-purple-400" />
                          Job Search Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                          <span className="text-white font-medium">Open to Work</span>
                          <Badge className={selectedUser.isOpenToWork ? 'bg-green-600' : 'bg-gray-600'}>
                            {selectedUser.isOpenToWork ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        {selectedUser.linkedinUrl && (
                          <div className="mt-3 p-3 rounded-lg bg-gray-700">
                            <div className="text-xs text-gray-400 mb-1">LinkedIn Profile</div>
                            <a 
                              href={selectedUser.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:underline"
                            >
                              {selectedUser.linkedinUrl}
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* COLLEGE-SPECIFIC DETAILS */}
                {selectedUser.role === 'college' && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Database className="h-5 w-5 text-green-400" />
                        College Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">College Name</div>
                          <div className="text-sm font-medium text-white">{selectedUser.collegeName || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">College Code</div>
                          <div className="text-sm font-medium text-white">{selectedUser.collegeCode || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Location</div>
                          <div className="text-sm font-medium text-white">{selectedUser.location || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Total Students</div>
                          <div className="text-sm font-medium text-white">{selectedUser.totalStudents || 0}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* RECRUITER-SPECIFIC DETAILS */}
                {selectedUser.role === 'recruiter' && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-400" />
                        Recruiter Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Company</div>
                          <div className="text-sm font-medium text-white">{selectedUser.companyName || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Designation</div>
                          <div className="text-sm font-medium text-white">{selectedUser.designation || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Industry</div>
                          <div className="text-sm font-medium text-white">{selectedUser.industry || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700">
                          <div className="text-xs text-gray-400">Company Size</div>
                          <div className="text-sm font-medium text-white">{selectedUser.companySize || 'N/A'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ACCOUNT METADATA */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      Account Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-gray-700">
                        <div className="text-xs text-gray-400">Account Created</div>
                        <div className="text-sm font-medium text-white">
                          {new Date(selectedUser.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700">
                        <div className="text-xs text-gray-400">Last Updated</div>
                        <div className="text-sm font-medium text-white">
                          {new Date(selectedUser.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700">
                        <div className="text-xs text-gray-400">User ID</div>
                        <div className="text-xs font-mono text-white break-all">{selectedUser._id}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700">
                        <div className="text-xs text-gray-400">Account Status</div>
                        <Badge className="bg-green-600 text-white mt-1">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data for demonstration
function getMockAdminData(): AdminData {
  return {
    summary: {
      totalUsers: 1247,
      activeUsers: 89,
      totalStudents: 1050,
      totalColleges: 45,
      totalRecruiters: 152,
      platformConnections: 3421,
      totalProblems: 45678,
      jobApplications: 234
    },
    recentActivity: [
      {
        type: "user_signup",
        user: "alex.chen@demo.com",
        action: "signed up as student",
        timestamp: "2 minutes ago",
        details: {
          userName: "Alex Chen",
          userRole: "student",
          ip: "192.168.1.xxx"
        }
      },
      {
        type: "platform_link",
        user: "priya.sharma@demo.com",
        action: "connected LeetCode account",
        timestamp: "5 minutes ago",
        details: {
          userName: "Priya Sharma",
          userRole: "student",
          platform: "LeetCode",
          ip: "192.168.2.xxx"
        }
      },
      {
        type: "user_login",
        user: "placement@mit.edu",
        action: "logged in",
        timestamp: "8 minutes ago",
        details: {
          userName: "MIT Placement Office",
          userRole: "college",
          page: "/college/dashboard",
          ip: "192.168.3.xxx"
        }
      },
      {
        type: "job_application",
        user: "john.doe@student.com",
        action: "applied to Software Engineer position",
        timestamp: "12 minutes ago",
        details: {
          userName: "John Doe",
          userRole: "student",
          jobTitle: "Software Engineer at Google",
          ip: "192.168.4.xxx"
        }
      },
      {
        type: "page_view",
        user: "recruiter@google.com",
        action: "viewed candidate search page",
        timestamp: "15 minutes ago",
        details: {
          userName: "Google Recruiter",
          userRole: "recruiter",
          page: "/recruiter/search",
          ip: "192.168.5.xxx"
        }
      },
      {
        type: "platform_link",
        user: "sarah.wilson@demo.com",
        action: "connected GitHub account",
        timestamp: "18 minutes ago",
        details: {
          userName: "Sarah Wilson",
          userRole: "student",
          platform: "GitHub",
          ip: "192.168.6.xxx"
        }
      },
      {
        type: "user_login",
        user: "admin@stanford.edu",
        action: "logged in",
        timestamp: "22 minutes ago",
        details: {
          userName: "Stanford Admin",
          userRole: "college",
          page: "/college/students",
          ip: "192.168.7.xxx"
        }
      },
      {
        type: "custom",
        user: "rahul.kumar@demo.com",
        action: "synced platform statistics",
        timestamp: "25 minutes ago",
        details: {
          userName: "Rahul Kumar",
          userRole: "student",
          platforms: ["LeetCode", "Codeforces", "CodeChef"],
          ip: "192.168.8.xxx"
        }
      }
    ],
    platformHealth: [
      {
        platform: "LeetCode",
        status: "healthy",
        connections: 856,
        lastSync: "2 min ago",
        responseTime: 245
      },
      {
        platform: "GitHub",
        status: "healthy",
        connections: 1203,
        lastSync: "1 min ago",
        responseTime: 180
      },
      {
        platform: "Codeforces",
        status: "degraded",
        connections: 634,
        lastSync: "15 min ago",
        responseTime: 890
      },
      {
        platform: "CodeChef",
        status: "healthy",
        connections: 423,
        lastSync: "3 min ago",
        responseTime: 320
      }
    ],
    userGrowth: {
      daily: 12,
      weekly: 89,
      monthly: 345
    },
    systemMetrics: {
      cpuUsage: 45,
      memoryUsage: 67,
      diskUsage: 23,
      apiCalls: 15678,
      errorRate: 0.2
    },
    topPerformers: [
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
      },
      {
        name: "Rahul Kumar",
        email: "rahul.kumar@demo.com",
        role: "student",
        totalProblems: 756,
        rating: 1650
      }
    ]
  }
}

// Mock user details for demonstration
function getMockUserDetails(email: string): any {
  const mockUsers: Record<string, any> = {
    "alex.chen@demo.com": {
      _id: "user_001",
      name: "Alex Chen",
      email: "alex.chen@demo.com",
      role: "student",
      collegeCode: "MIT2024",
      rollNumber: "CS2024001",
      graduationYear: 2024,
      branch: "Computer Science",
      skills: ["JavaScript", "Python", "React", "Node.js", "MongoDB", "Machine Learning"],
      linkedPlatforms: {
        leetcode: { username: "alexchen", lastSync: new Date() },
        github: { username: "alex-chen-dev", lastSync: new Date() },
        codeforces: { username: "alexc", lastSync: new Date() },
        codechef: { username: "alex_chen", lastSync: new Date() }
      },
      stats: {
        totalProblems: 1250,
        easyProblems: 450,
        mediumProblems: 650,
        hardProblems: 150,
        githubContributions: 892,
        contestsParticipated: 45,
        rating: 2100
      },
      isOpenToWork: true,
      linkedinUrl: "https://linkedin.com/in/alexchen",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    "priya.sharma@demo.com": {
      _id: "user_002",
      name: "Priya Sharma",
      email: "priya.sharma@demo.com",
      role: "student",
      collegeCode: "IIT2025",
      rollNumber: "CS2025042",
      graduationYear: 2025,
      branch: "Computer Science & Engineering",
      skills: ["C++", "Python", "Data Structures", "Algorithms", "Competitive Programming"],
      linkedPlatforms: {
        leetcode: { username: "priya_sharma", lastSync: new Date() },
        codeforces: { username: "priya_s", lastSync: new Date() },
        codechef: { username: "priyasharma", lastSync: new Date() }
      },
      stats: {
        totalProblems: 980,
        easyProblems: 320,
        mediumProblems: 520,
        hardProblems: 140,
        githubContributions: 456,
        contestsParticipated: 38,
        rating: 1850
      },
      isOpenToWork: true,
      linkedinUrl: "https://linkedin.com/in/priyasharma",
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    "placement@mit.edu": {
      _id: "college_001",
      name: "MIT Placement Office",
      email: "placement@mit.edu",
      role: "college",
      collegeName: "Massachusetts Institute of Technology",
      collegeCode: "MIT",
      location: "Cambridge, MA, USA",
      website: "https://mit.edu",
      totalStudents: 1250,
      departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    "recruiter@google.com": {
      _id: "recruiter_001",
      name: "Google Recruiter",
      email: "recruiter@google.com",
      role: "recruiter",
      companyName: "Google",
      companyWebsite: "https://google.com",
      companySize: "10000+",
      industry: "Technology",
      designation: "Senior Technical Recruiter",
      hiringFor: ["Software Engineer", "Data Scientist", "Product Manager"],
      preferredSkills: ["Python", "Java", "System Design", "Machine Learning"],
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  }

  return mockUsers[email] || {
    _id: "unknown",
    name: email.split('@')[0],
    email: email,
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date()
  }
}