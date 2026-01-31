import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { fetchGeeksforGeeksStats } from "@/lib/platforms/geeksforgeeks"

export async function POST() {
  try {
    console.log("=== FIXING GEEKSFORGEEKS CONNECTIONS ===")
    
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
    
    // Find GeeksforGeeks connections (might be stored with different keys)
    const geeksConnections = Object.entries(linkedPlatforms).filter(([platformId, data]) => {
      const key = platformId.toLowerCase()
      return key === 'geeksforgeeks' || key.includes('geek')
    })
    
    console.log("Found GeeksforGeeks connections:", geeksConnections.map(([id]) => id))
    
    if (geeksConnections.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No GeeksforGeeks connections found to fix"
      })
    }
    
    const results = []
    
    for (const [platformId, platformData] of geeksConnections) {
      if (!platformData?.username) {
        console.log(`Skipping ${platformId} - no username`)
        continue
      }
      
      console.log(`Fixing ${platformId} with username: ${platformData.username}`)
      
      try {
        // Fetch fresh stats using specific GeeksforGeeks fetcher
        const freshStats = await fetchGeeksforGeeksStats(platformData.username)
        console.log(`Fresh GeeksforGeeks stats:`, freshStats)
        
        if (freshStats) {
          // Update the platform data with fresh stats
          await UserModel.update(user._id as string, {
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: freshStats
          })
          
          results.push({
            platformId,
            success: true,
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
      message: "GeeksforGeeks connections fix completed",
      results
    })
    
  } catch (error) {
    console.error("Fix GeeksforGeeks error:", error)
    return NextResponse.json(
      { 
        error: `Failed to fix GeeksforGeeks connections: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "GeeksforGeeks Fix Endpoint",
    usage: "POST to fix existing GeeksforGeeks connections",
    description: "This endpoint will find all GeeksforGeeks connections and update them with fresh stats using the specific fetcher"
  })
}