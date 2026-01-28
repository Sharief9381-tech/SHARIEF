"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, Trophy, GitBranch, Loader2, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface AddPlatformDialogProps {
  onPlatformAdded?: () => void
}

const platforms = [
  {
    id: "leetcode",
    name: "LeetCode",
    description: "Practice coding problems and prepare for interviews",
    color: "#FFA116",
    url: "https://leetcode.com",
    icon: Code,
    placeholder: "Enter your LeetCode username",
    example: "e.g., john_doe"
  },
  {
    id: "github",
    name: "GitHub",
    description: "Showcase your projects and contributions",
    color: "#238636",
    url: "https://github.com",
    icon: GitBranch,
    placeholder: "Enter your GitHub username",
    example: "e.g., johndoe"
  },
  {
    id: "codeforces",
    name: "Codeforces",
    description: "Competitive programming and algorithmic contests",
    color: "#1890FF",
    url: "https://codeforces.com",
    icon: Trophy,
    placeholder: "Enter your Codeforces handle",
    example: "e.g., tourist"
  },
  {
    id: "codechef",
    name: "CodeChef",
    description: "Monthly contests and practice problems",
    color: "#5B4638",
    url: "https://codechef.com",
    icon: Code,
    placeholder: "Enter your CodeChef username",
    example: "e.g., admin"
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    description: "Skills assessment and coding challenges",
    color: "#00EA64",
    url: "https://hackerrank.com",
    icon: Trophy,
    placeholder: "Enter your HackerRank username",
    example: "e.g., username"
  },
  {
    id: "hackerearth",
    name: "HackerEarth",
    description: "Programming challenges and hackathons",
    color: "#323754",
    url: "https://hackerearth.com",
    icon: Code,
    placeholder: "Enter your HackerEarth username",
    example: "e.g., @username"
  }
]

export function AddPlatformDialog({ onPlatformAdded }: AddPlatformDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<typeof platforms[0] | null>(null)
  const [username, setUsername] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!selectedPlatform || !username.trim()) {
      toast.error("Please select a platform and enter your username")
      return
    }

    setIsConnecting(true)
    
    try {
      const response = await fetch("/api/platforms/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          username: username.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`Successfully connected ${selectedPlatform.name}! Fetching stats...`)
        setOpen(false)
        setSelectedPlatform(null)
        setUsername("")
        
        // Call the callback to update parent component
        if (onPlatformAdded) {
          await onPlatformAdded()
        }
      } else {
        toast.error(data.error || "Failed to connect platform")
      }
    } catch (error) {
      console.error("Connection error:", error)
      toast.error("Failed to connect platform. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleBack = () => {
    setSelectedPlatform(null)
    setUsername("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedPlatform ? `Connect ${selectedPlatform.name}` : "Add Coding Platform"}
          </DialogTitle>
        </DialogHeader>

        {!selectedPlatform ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a platform to connect and track your coding progress
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {platforms.map((platform) => {
                const IconComponent = platform.icon
                return (
                  <Card
                    key={platform.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                    onClick={() => setSelectedPlatform(platform)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: platform.color + '20', border: `1px solid ${platform.color}` }}
                        >
                          <IconComponent 
                            className="h-5 w-5" 
                            style={{ color: platform.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{platform.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Site
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <Badge variant="outline" className="text-xs">
                          Connect
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div 
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedPlatform.color + '20', border: `2px solid ${selectedPlatform.color}` }}
              >
                <selectedPlatform.icon 
                  className="h-6 w-6" 
                  style={{ color: selectedPlatform.color }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{selectedPlatform.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlatform.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder={selectedPlatform.placeholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isConnecting}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedPlatform.example}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="font-medium text-sm mb-1">How to find your username:</h5>
                <p className="text-xs text-muted-foreground">
                  Visit your {selectedPlatform.name} profile and copy the username from the URL or profile section.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isConnecting}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !username.trim()}
                className="flex-1 gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Connect Platform
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}