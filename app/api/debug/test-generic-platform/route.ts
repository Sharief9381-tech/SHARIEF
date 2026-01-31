import { NextRequest, NextResponse } from "next/server"
import { fetchGenericPlatformStats } from "@/lib/platforms/generic"
import { fetchGeeksforGeeksStats } from "@/lib/platforms/geeksforgeeks"
import { fetchAtCoderStats } from "@/lib/platforms/atcoder"
import { fetchSPOJStats } from "@/lib/platforms/spoj"
import { fetchKattisStats } from "@/lib/platforms/kattis"

export async function POST(request: NextRequest) {
  try {
    const { platformId, username, platformUrl } = await request.json()

    if (!platformId || !username) {
      return NextResponse.json(
        { error: "platformId and username are required" },
        { status: 400 }
      )
    }

    console.log(`\n=== TESTING PLATFORM: ${platformId} ===`)
    console.log(`Username: ${username}`)
    console.log(`Platform URL: ${platformUrl}`)

    let stats = null
    let fetchMethod = 'unknown'
    
    // Test specific fetchers for different platforms
    if (platformId === 'geeksforgeeks') {
      console.log('Testing specific GeeksforGeeks fetcher...')
      const specificStats = await fetchGeeksforGeeksStats(username)
      console.log('Specific GeeksforGeeks stats:', specificStats)
      
      console.log('Testing generic fetcher for comparison...')
      const genericStats = await fetchGenericPlatformStats(platformId, username, platformUrl)
      console.log('Generic GeeksforGeeks stats:', genericStats)
      
      return NextResponse.json({
        success: true,
        platformId,
        username,
        platformUrl,
        specificStats,
        genericStats,
        message: "Both specific and generic GeeksforGeeks stats fetched for comparison"
      })
    } else if (platformId === 'atcoder') {
      console.log('Testing specific AtCoder fetcher...')
      stats = await fetchAtCoderStats(username)
      fetchMethod = 'specific_atcoder_fetcher'
    } else if (platformId === 'spoj') {
      console.log('Testing specific SPOJ fetcher...')
      stats = await fetchSPOJStats(username)
      fetchMethod = 'specific_spoj_fetcher'
    } else if (platformId === 'kattis') {
      console.log('Testing specific Kattis fetcher...')
      stats = await fetchKattisStats(username)
      fetchMethod = 'specific_kattis_fetcher'
    } else {
      console.log('Using generic platform fetcher...')
      stats = await fetchGenericPlatformStats(platformId, username, platformUrl)
      fetchMethod = 'generic_platform_fetcher'
    }

    return NextResponse.json({
      success: true,
      platformId,
      username,
      platformUrl,
      stats,
      fetchMethod,
      message: "Platform stats fetched successfully"
    })

  } catch (error) {
    console.error("Test platform error:", error)
    return NextResponse.json(
      { 
        error: `Failed to test platform: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Generic Platform Test Endpoint",
    usage: "POST with { platformId, username, platformUrl? }",
    example: {
      platformId: "geeksforgeeks",
      username: "your_username",
      platformUrl: "https://www.geeksforgeeks.org"
    }
  })
}