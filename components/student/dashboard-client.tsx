"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { StudentProfile } from "@/lib/types"
import { AddPlatformDialog } from "@/components/student/add-platform-dialog"
import { 
  Code, 
  GitBranch, 
  Trophy, 
  Star,
  ExternalLink,
  TrendingUp,
  Activity,
  Check,
  Trash2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DashboardClientProps {
  student: StudentProfile
}

export function DashboardClient({ student: initialStudent }: DashboardClientProps) {
  const [student, setStudent] = useState(initialStudent)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handlePlatformAdded = useCallback(async () => {
    setIsUpdating(true)
    
    // Small delay to ensure database is updated
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Trigger platform sync to fetch stats for newly added platforms
    try {
      const syncResponse = await fetch('/api/platforms/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (syncResponse.ok) {
        console.log('Platform sync completed successfully')
      } else {
        console.log('Platform sync failed, continuing with user data fetch')
      }
    } catch (error) {
      console.error('Error syncing platforms:', error)
    }
    
    // Fetch fresh user data after platform is added and synced
    try {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          console.log('Updated user data:', userData.user)
          setStudent(userData.user)
        }
      }
    } catch (error) {
      console.error('Error fetching updated user data:', error)
      // Fallback to page refresh if API fails
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }, [router])

  const handleUnlinkPlatform = useCallback(async (platformId: string, platformName: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/platforms/link", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: platformId,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`Successfully unlinked ${platformName}!`)
        
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Fetch fresh user data after unlinking
        try {
          const userResponse = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store' // Ensure fresh data
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            if (userData.user) {
              console.log('Updated user data after unlink:', userData.user)
              setStudent(userData.user)
            }
          }
        } catch (error) {
          console.error('Error fetching updated user data:', error)
          // Fallback to page refresh if API fails
          router.refresh()
        }
      } else {
        toast.error(data.error || "Failed to unlink platform")
      }
    } catch (error) {
      console.error("Unlink error:", error)
      toast.error("Failed to unlink platform. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }, [router])

  const linkedPlatforms = student.linkedPlatforms || {}
  const hasLinkedPlatforms = Object.keys(linkedPlatforms).length > 0

  // Debug: Log the linkedPlatforms structure
  console.log("LinkedPlatforms structure:", linkedPlatforms)

  // Calculate aggregated stats from linked platforms
  const calculateStats = () => {
    let totalProblems = 0
    let githubContributions = 0
    let contests = 0
    let currentRating = 0

    Object.entries(linkedPlatforms).forEach(([platform, data]) => {
      // Skip null or undefined data
      if (!data) return
      
      // Handle both object and string data structures
      const stats = (typeof data === 'object' && 'stats' in data) ? data.stats : null
      
      if (stats) {
        switch (platform) {
          case 'leetcode':
            totalProblems += (stats.totalSolved || 0)
            break
          case 'github':
            githubContributions += (stats.totalContributions || 0)
            break
          case 'codeforces':
            contests += (stats.contests?.length || 0)
            currentRating = Math.max(currentRating, stats.rating || 0)
            totalProblems += (stats.problemsSolved || 0)
            break
          case 'codechef':
            totalProblems += (stats.problemsSolved || 0)
            currentRating = Math.max(currentRating, stats.currentRating || 0)
            break
          case 'hackerrank':
            // HackerRank doesn't have problems solved in the same way
            break
          case 'hackerearth':
            totalProblems += (stats.problemsSolved || 0)
            currentRating = Math.max(currentRating, stats.rating || 0)
            break
        }
      }
    })

    return { totalProblems, githubContributions, contests, currentRating }
  }

  const stats = calculateStats()

  const renderPlatformCard = (platformId: string, platformData: any) => {
    // Handle null or undefined platformData
    if (!platformData) {
      return null
    }

    const platformConfigs = {
      leetcode: { 
        name: "LeetCode", 
        color: "orange-500", 
        bgColor: "bg-gray-900", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.totalSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://leetcode.com/u/${username}/`
      },
      codechef: { 
        name: "CodeChef", 
        color: "orange-600", 
        bgColor: "bg-gray-900", 
        icon: Code,
        getSummary: (stats: any) => stats?.stars || '1*',
        getProfileUrl: (username: string) => `https://www.codechef.com/users/${username}`
      },
      hackerrank: { 
        name: "HackerRank", 
        color: "green-500", 
        bgColor: "bg-gray-900", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.badges?.length || 0} badges`,
        getProfileUrl: (username: string) => `https://www.hackerrank.com/profile/${username}`
      },
      github: { 
        name: "GitHub", 
        color: "gray-500", 
        bgColor: "bg-gray-900", 
        icon: GitBranch,
        getSummary: (stats: any) => `${stats?.publicRepos || 0} repos`,
        getProfileUrl: (username: string) => `https://github.com/${username}`
      },
      codeforces: { 
        name: "Codeforces", 
        color: "blue-500", 
        bgColor: "bg-gray-900", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.rating || 0} rating`,
        getProfileUrl: (username: string) => `https://codeforces.com/profile/${username}`
      },
      hackerearth: { 
        name: "HackerEarth", 
        color: "purple-500", 
        bgColor: "bg-gray-900", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://www.hackerearth.com/@${username}`
      }
    }

    const config = platformConfigs[platformId as keyof typeof platformConfigs]
    if (!config) return null

    const IconComponent = config.icon
    
    // Handle different platformData structures
    const stats = platformData?.stats || {}
    let username = 'username'
    
    // Extract username from the platform data structure
    if (platformData?.username) {
      // Standard structure: { username: "user", linkedAt: Date, isActive: true, stats: {...} }
      username = platformData.username
    } else if (typeof platformData === 'string') {
      // Fallback: direct string username
      username = platformData
    }
    
    // Clean username (remove any URL parts if user entered full URL or if it contains path segments)
    username = username.replace(/^https?:\/\/[^\/]+\//, '') // Remove full URL prefix
                      .replace(/^u\//, '')                    // Remove LeetCode /u/ prefix
                      .replace(/^profile\//, '')              // Remove HackerRank /profile/ prefix
                      .replace(/^users\//, '')                // Remove CodeChef /users/ prefix
                      .replace(/^@/, '')                      // Remove @ prefix if present
                      .replace(/\/$/, '')                     // Remove trailing slash
    
    console.log(`Platform ${platformId} - Cleaned Username: ${username}, Original Data:`, platformData)

    return (
      <Card key={platformId} className={`${config.bgColor} border-l-4 border-l-${config.color} text-white relative h-80`}>
        <CardContent className="p-6 pb-16 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`h-8 w-8 rounded-full bg-${config.color} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white truncate">{config.name}</h4>
                <p className="text-xs text-gray-400 truncate">@{username}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-white">{config.getSummary(stats)}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-hidden">
            {!stats || Object.keys(stats).length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Fetching latest stats...
                  </div>
                </div>
              </div>
            ) : (
              <>
            {platformId === 'leetcode' && (
              <>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Problems Solved</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{stats.easySolved || 0}</div>
                      <div className="text-xs text-gray-400">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{stats.mediumSolved || 0}</div>
                      <div className="text-xs text-gray-400">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{stats.hardSolved || 0}</div>
                      <div className="text-xs text-gray-400">Hard</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-400">{stats.ranking?.toLocaleString() || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Global Ranking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-400">{stats.contributionPoints || 0}</div>
                    <div className="text-xs text-gray-400">Contribution Points</div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'codechef' && (
              <>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Coding Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.currentRating || 0}</div>
                      <div className="text-xs text-gray-400">Current Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{stats.stars || '1*'}</div>
                      <div className="text-xs text-gray-400">Stars</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-400">{stats.highestRating || 0}</div>
                    <div className="text-xs text-gray-400">Highest Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-400">{stats.globalRank || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Global Rank</div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'hackerrank' && (
              <>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Achievements Overview</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{stats.badges?.length || 0}</div>
                      <div className="text-xs text-gray-400">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.certifications?.length || 0}</div>
                      <div className="text-xs text-gray-400">Certifications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.skills?.length || 0}</div>
                      <div className="text-xs text-gray-400">Skills</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-400">{stats.totalScore || 0}</div>
                    <div className="text-xs text-gray-400">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-400">{stats.globalRank || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Global Rank</div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'github' && (
              <>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Development Activity</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{stats.totalContributions || 0}</div>
                      <div className="text-xs text-gray-400">Contributions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.publicRepos || 0}</div>
                      <div className="text-xs text-gray-400">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.followers || 0}</div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-yellow-400">{Object.keys(stats.languages || {}).length}</div>
                    <div className="text-xs text-gray-400">Languages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-400">{stats.following || 0}</div>
                    <div className="text-xs text-gray-400">Following</div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'codeforces' && (
              <>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Competitive Programming</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.rating || 0}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.contests?.length || 0}</div>
                      <div className="text-xs text-gray-400">Contests</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-400">{stats.maxRating || 0}</div>
                    <div className="text-xs text-gray-400">Max Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-400">{stats.rank || 'Unrated'}</div>
                    <div className="text-xs text-gray-400">Rank</div>
                  </div>
                </div>
              </>
            )}
              </>
            )}
          </div>
        </CardContent>
        
        {/* Bottom section with View Details link, Verified badge, and Unlink button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <a
              href={config.getProfileUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              View Details
              <ExternalLink className="h-4 w-4" />
            </a>
            <div className="flex-1 flex justify-center">
              <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-lg">
                <Check className="h-3 w-3" />
                Verified
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnlinkPlatform(platformId, config.name)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
              title={`Unlink ${config.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {isUpdating && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Updating dashboard...
        </div>
      )}
      
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Problems</p>
                <p className="text-2xl font-bold">{stats.totalProblems}</p>
              </div>
              <Code className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GitHub Contributions</p>
                <p className="text-2xl font-bold">{stats.githubContributions}</p>
              </div>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contest</p>
                <p className="text-2xl font-bold">{stats.contests}</p>
              </div>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Rating</p>
                <p className="text-2xl font-bold">{stats.currentRating}</p>
              </div>
              <Star className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Platforms */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connected Platforms</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setIsUpdating(true)
                  try {
                    const response = await fetch('/api/platforms/sync', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    
                    if (response.ok) {
                      const syncData = await response.json()
                      console.log('Sync response:', syncData)
                      
                      if (syncData.summary) {
                        toast.success(`Stats synced! ${syncData.summary.successful}/${syncData.summary.total} platforms updated`)
                      } else {
                        toast.success('Stats synced successfully!')
                      }
                      
                      // Fetch fresh user data
                      const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        cache: 'no-store'
                      })
                      
                      if (userResponse.ok) {
                        const userData = await userResponse.json()
                        if (userData.user) {
                          setStudent(userData.user)
                        }
                      }
                    } else {
                      const errorData = await response.json()
                      toast.error(errorData.error || 'Failed to sync stats')
                    }
                  } catch (error) {
                    console.error('Sync error:', error)
                    toast.error('Failed to sync stats')
                  } finally {
                    setIsUpdating(false)
                  }
                }}
                disabled={isUpdating || !hasLinkedPlatforms}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Sync Stats
              </Button>
              <AddPlatformDialog onPlatformAdded={handlePlatformAdded} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Link your coding platforms to track your progress
          </p>
        </CardHeader>
        <CardContent>
          {hasLinkedPlatforms ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(linkedPlatforms)
                .filter(([platformId, platformData]) => platformData != null)
                .map(([platformId, platformData]) => 
                  renderPlatformCard(platformId, platformData)
                )
                .filter(Boolean)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Platforms Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your coding platforms to see your progress and statistics
              </p>
              <AddPlatformDialog onPlatformAdded={handlePlatformAdded} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Skills Distribution and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Easy</span>
                  <span className="text-sm text-muted-foreground">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medium</span>
                  <span className="text-sm text-muted-foreground">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hard</span>
                  <span className="text-sm text-muted-foreground">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {hasLinkedPlatforms ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Solved Two Sum</p>
                    <p className="text-xs text-muted-foreground">LeetCode • 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Pushed to portfolio</p>
                    <p className="text-xs text-muted-foreground">GitHub • 5 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Solved Binary Tree Inorder</p>
                    <p className="text-xs text-muted-foreground">LeetCode • 1 day ago</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Connect platforms to see your recent activity
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your coding profile based on activity level and problem difficulty distribution
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Activity Level</h4>
              <Badge variant="secondary">
                {stats.totalProblems > 100 ? 'Active' : stats.totalProblems > 50 ? 'Moderate' : 'Beginner'}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-3">Average Time</h4>
              <Badge variant="secondary">
                {hasLinkedPlatforms ? 'Regular' : 'Casual'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}