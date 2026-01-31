"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, RefreshCw, Users } from "lucide-react"

interface TopPerformer {
  id: string
  name: string
  email: string
  rollNumber: string
  branch: string
  totalProblems: number
  githubContributions: number
  contestsAttended: number
  currentRating: number
  overallRank: string
  activityLevel: string
  placementStatus: string
}

export function TopPerformers() {
  const [performers, setPerformers] = useState<TopPerformer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopPerformers()
  }, [])

  const fetchTopPerformers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/college/dashboard')
      if (response.ok) {
        const data = await response.json()
        setPerformers(data.topPerformers || [])
      } else {
        console.error('Failed to fetch top performers:', response.status)
      }
    } catch (error) {
      console.error('Error fetching top performers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-500"
    if (rank === 2) return "bg-gray-400/20 text-gray-400"
    if (rank === 3) return "bg-amber-600/20 text-amber-600"
    return "bg-secondary text-muted-foreground"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "placed":
        return <Badge className="bg-green-500/20 text-green-500 text-xs">Placed</Badge>
      case "interviewing":
        return <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Interviewing</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">Searching</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <Trophy className="h-5 w-5 text-chart-3" />
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div className="h-6 w-6 bg-secondary rounded" />
                <div className="h-10 w-10 bg-secondary rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-secondary rounded" />
                  <div className="h-3 w-16 bg-secondary rounded" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-12 bg-secondary rounded" />
                  <div className="h-3 w-16 bg-secondary rounded" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chart-3" />
          <CardTitle>Top Performers</CardTitle>
        </div>
        <button
          onClick={fetchTopPerformers}
          disabled={loading}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {performers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No student data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Students need to link their coding platforms to appear here
            </p>
          </div>
        ) : (
          performers.slice(0, 10).map((performer, index) => (
            <div
              key={performer.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <Badge className={`h-6 w-6 justify-center ${getRankBadge(index + 1)}`}>
                {index + 1}
              </Badge>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {performer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{performer.name}</p>
                  {getStatusBadge(performer.placementStatus)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{performer.rollNumber}</span>
                  <span>•</span>
                  <span>{performer.branch}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">{performer.totalProblems}</p>
                <p className="text-xs text-muted-foreground">problems</p>
              </div>
            </div>
          ))
        )}
        
        {performers.length > 10 && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Showing top 10 of {performers.length} students
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
