"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, Trophy, Briefcase, RefreshCw } from "lucide-react"
import type { CollegeProfile } from "@/lib/types"

interface CollegeStatsProps {
  college: CollegeProfile
}

interface DashboardData {
  college: {
    name: string
    code: string
    location?: string
  }
  overview: {
    totalStudents: number
    activeStudents: number
    registrationRate: number
    avgProblems: number
    avgContributions: number
    avgRating: number
    placementRate: number
  }
}

export function CollegeStats({ college }: CollegeStatsProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/college/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to fetch dashboard data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 bg-secondary rounded-lg" />
                  <div className="h-4 w-16 bg-secondary rounded" />
                </div>
                <div className="h-8 w-20 bg-secondary rounded mb-2" />
                <div className="h-4 w-24 bg-secondary rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 text-primary hover:underline"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Students",
      value: dashboardData.overview.totalStudents,
      icon: GraduationCap,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Active Students",
      value: dashboardData.overview.activeStudents,
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Avg. Problems Solved",
      value: dashboardData.overview.avgProblems,
      icon: Trophy,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Placement Rate",
      value: `${dashboardData.overview.placementRate}%`,
      icon: Briefcase,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {dashboardData.college.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            College Code: {dashboardData.college.code}
            {dashboardData.college.location && ` • ${dashboardData.college.location}`}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-card">
              <CardContent className="p-4">
                {/* Icon and number in same row - maximum right */}
                <div className="flex items-center mb-3 pl-12">
                  <div className={`rounded-lg p-2 ${stat.bgColor} mr-3`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </div>
                
                {/* Label below - centered */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
