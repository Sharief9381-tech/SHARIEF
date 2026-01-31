import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { PlatformSyncService } from "@/lib/services/platform-sync"

export async function POST() {
  try {
    console.log("=== CLEARING FAKE STATS AND FORCING REAL SYNC ===")
    
    const user = await getCurrentUser()
    console.log("Current user:", user ? { id: user._id, role: user.role } : "null")
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    if (user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can clear stats" },
        { status: 403 }
      )
    }

    const userId = user._id as string
    const linkedPlatforms = (user as any).linkedPlatforms || {}
    
    console.log("User linked platforms before clearing:", linkedPlatforms)
    
    // Step 1: Clear all cached stats from all linked platforms
    const clearUpdates: Record<string, any> = {}
    
    for (const platformId of Object.keys(linkedPlatforms)) {
      if (linkedPlatforms[platformId]) {
        console.log(`Clearing cached stats for platform: ${platformId}`)
        clearUpdates[`linkedPlatforms.${platformId}.stats`] = null
        clearUpdates[`linkedPlatforms.${platformId}.lastSync`] = null
      }
    }
    
    if (Object.keys(clearUpdates).length > 0) {
      await UserModel.update(userId, clearUpdates)
      console.log("✅ Cleared all cached fake stats")
    }
    
    // Step 2: Force fresh sync with real stats
    console.log("🔄 Starting fresh sync with real stats...")
    const syncResults = await PlatformSyncService.syncUserPlatforms(userId)
    
    console.log("Fresh sync results:", syncResults)
    
    // Count results
    const successful = syncResults.filter(r => r.success).length
    const failed = syncResults.filter(r => !r.success).length
    
    return NextResponse.json({
      success: true,
      message: "Cleared fake stats and synced with real data",
      results: syncResults,
      summary: {
        clearedPlatforms: Object.keys(clearUpdates).length / 2, // Divide by 2 because we set both stats and lastSync
        syncedSuccessfully: successful,
        syncFailed: failed,
        totalPlatforms: syncResults.length
      },
      timestamp: new Date()
    })
    
  } catch (error) {
    console.error("=== CLEAR FAKE STATS ERROR ===", error)
    return NextResponse.json(
      { error: `Failed to clear fake stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    if (user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can view platform data" },
        { status: 403 }
      )
    }

    const linkedPlatforms = (user as any).linkedPlatforms || {}
    
    // Analyze current stats to identify potentially fake data
    const analysis: Record<string, any> = {}
    
    for (const [platformId, platformData] of Object.entries(linkedPlatforms)) {
      if (platformData && typeof platformData === 'object' && 'stats' in platformData) {
        const stats = platformData.stats
        const lastSync = platformData.lastSync
        
        analysis[platformId] = {
          hasStats: !!stats,
          lastSync: lastSync,
          statsKeys: stats ? Object.keys(stats) : [],
          potentiallyFake: !lastSync || (stats && Object.keys(stats).length > 0 && !lastSync)
        }
      }
    }
    
    return NextResponse.json({
      linkedPlatforms: Object.keys(linkedPlatforms),
      analysis,
      recommendation: "Use POST to clear fake stats and fetch real data"
    })
    
  } catch (error) {
    console.error("Get fake stats analysis error:", error)
    return NextResponse.json(
      { error: `Failed to analyze stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}