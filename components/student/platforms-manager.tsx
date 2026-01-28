"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Plus, Code, Trophy, GitBranch, Check } from "lucide-react"
import type { StudentProfile } from "@/lib/types"

interface PlatformsManagerProps {
  student: StudentProfile
}

const platforms = [
  {
    id: "leetcode",
    name: "LeetCode",
    description: "Practice coding problems and prepare for interviews",
    color: "#FFA116",
    url: "https://leetcode.com",
    features: ["Problem Solving", "Interview Prep", "Contests"],
    icon: Code,
    instructions: "Enter your LeetCode username or profile URL",
    placeholder: "e.g., john_doe",
    isCustom: false,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Showcase your projects and contributions",
    color: "#238636",
    url: "https://github.com",
    features: ["Projects", "Contributions", "Collaboration"],
    icon: GitBranch,
    instructions: "Enter your GitHub username or profile URL",
    placeholder: "e.g., johndoe",
    isCustom: false,
  },
  {
    id: "codeforces",
    name: "Codeforces",
    description: "Competitive programming and algorithmic contests",
    color: "#1890FF",
    url: "https://codeforces.com",
    features: ["Competitive", "Contests", "Rating"],
    icon: Trophy,
    instructions: "Enter your Codeforces handle or profile URL",
    placeholder: "e.g., tourist",
    isCustom: false,
  },
  {
    id: "codechef",
    name: "CodeChef",
    description: "Monthly contests and practice problems",
    color: "#5B4638",
    url: "https://codechef.com",
    features: ["Contests", "Practice", "Learning"],
    icon: Code,
    instructions: "Enter your CodeChef username or profile URL",
    placeholder: "e.g., admin",
    isCustom: false,
  },
]

export function PlatformsManager({ student }: PlatformsManagerProps) {
  const [linkedPlatforms] = useState<Record<string, string>>(() => {
    const studentPlatforms = student.linkedPlatforms || {}
    return Object.fromEntries(
      Object.entries(studentPlatforms).map(([key, value]) => {
        const username = typeof value === 'string' ? value : value?.username || ''
        return [key, username]
      })
    )
  })

  const linkedPlatformsList = platforms.filter(p => linkedPlatforms[p.id])

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
      </div>

      {linkedPlatformsList.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {linkedPlatformsList.map((platform) => {
            const linkedUsername = linkedPlatforms[platform.id]

            return (
              <Card key={platform.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-gray-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: platform.color + '20', border: `2px solid ${platform.color}` }}
                      >
                        <platform.icon 
                          className="h-6 w-6" 
                          style={{ color: platform.color }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{platform.name}</h4>
                        <p className="text-sm text-gray-400">@{linkedUsername}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-lg text-green-400 font-bold mb-2">✅ Platform Connected</div>
                    <div className="text-sm text-gray-400">Ready to sync data</div>
                  </div>

                  <div className="pt-4 border-t border-gray-700 flex items-center justify-between">
                    <a
                      href={`${platform.url}/${linkedUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
                    >
                      View Profile
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-lg">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-2xl">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6 border-2 border-gray-600">
              <Code className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">No Platforms Connected</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Connect your coding platforms to start tracking your progress and showcase your skills across different platforms
            </p>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4" />
              Add Your First Platform
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}