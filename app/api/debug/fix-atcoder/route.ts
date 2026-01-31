import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { fetchAtCoderStats } from "@/lib/platforms/atcoder"

export async function POST() {
  try {
    console.log("=== FIXING ATCODER STATS ===")
    
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    if (user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can fix platform connections" },
        { status: 403 }
      )
    }

    const linkedPlatforms = user.linkedPlatforms || {}
    console.log("Current linked platforms:", Object.keys(linkedPlatforms))
    
    // Find AtCoder connections
    const atcoderConnections = Object.entries(linkedPlatforms).filter(([platformId, data]) => {
      const key = platformId.toLowerCase()
      return key === 'atcoder'
    })
    
    console.log("Found AtCoder connections:", atcoderConnections.map(([id]) => id))
    
    if (atcoderConnections.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No AtCoder connections found to fix"
      })
    }
    
    const results = []
    
    for (const [platformId, platformData] of atcoderConnections) {
      if (!platformData?.username) {
        console.log(`Skipping ${platformId} - no username`)
        continue
      }
      
      // Clean the username (remove URL if it was stored as full URL)
      let cleanUsername = platformData.username
      if (cleanUsername.includes('atcoder.jp/users/')) {
        const match = cleanUsername.match(/atcoder\.jp\/users\/([^\/\?]+)/)
        if (match) {
          cleanUsername = match[1]
        }
      }
      
      console.log(`Fixing ${platformId} with username: ${cleanUsername}`)
      
      try {
        // Fetch fresh stats using specific AtCoder fetcher
        const freshStats = await fetchAtCoderStats(cleanUsername)
        console.log(`Fresh AtCoder stats:`, freshStats)
        
        if (freshStats) {
          // Update the platform data with fresh stats and clean username
          await UserModel.update(user._id as string, {
            [`linkedPlatforms.${platformId}.username`]: cleanUsername,
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: freshStats
          })
          
          results.push({
            platformId,
            success: true,
            oldUsername: platformData.username,
            newUsername: cleanUsername,
            stats: freshStats
          })
          
          console.log(`Successfully updated ${platformId}`)
        } else {
          results.push({
            platformId,
            success: false,
            error: "Failed to fetch fresh stats"
          })
        }
      } catch (error) {
        console.error(`Error fixing ${platformId}:`, error)
        results.push({
          platformId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "AtCoder connections fix completed",
      results
    })
    
  } catch (error) {
    console.error("Fix AtCoder error:", error)
    return NextResponse.json(
      { 
        error: `Failed to fix AtCoder connections: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AtCoder Fix Endpoint",
    usage: "POST to fix existing AtCoder connections with real stats",
    description: "This endpoint will find all AtCoder connections and update them with fresh real stats"
  })
}