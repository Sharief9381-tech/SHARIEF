import { NextResponse } from "next/server"
import { fetchLeetCodeStats } from "@/lib/platforms/leetcode"
import { fetchGitHubStats } from "@/lib/platforms/github"
import { fetchCodeChefStats } from "@/lib/platforms/codechef"
import { fetchCodeforcesStats } from "@/lib/platforms/codeforces"
import { fetchHackerRankStats } from "@/lib/platforms/hackerrank"
import { fetchHackerEarthStats } from "@/lib/platforms/hackerearth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const username = searchParams.get('username')

    if (!platform || !username) {
      return NextResponse.json(
        { error: "Platform and username are required" },
        { status: 400 }
      )
    }

    console.log(`Testing ${platform} API for username: ${username}`)

    let stats = null
    let error = null

    try {
      switch (platform.toLowerCase()) {
        case 'leetcode':
          stats = await fetchLeetCodeStats(username)
          break
        case 'github':
          stats = await fetchGitHubStats(username)
          break
        case 'codechef':
          stats = await fetchCodeChefStats(username)
          break
        case 'codeforces':
          stats = await fetchCodeforcesStats(username)
          break
        case 'hackerrank':
          stats = await fetchHackerRankStats(username)
          break
        case 'hackerearth':
          stats = await fetchHackerEarthStats(username)
          break
        default:
          return NextResponse.json(
            { error: "Unsupported platform" },
            { status: 400 }
          )
      }
    } catch (fetchError: any) {
      error = fetchError.message
      console.error(`Error fetching ${platform} stats:`, fetchError)
    }

    return NextResponse.json({
      platform,
      username,
      success: stats !== null,
      stats,
      error,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Test platform API error:", error)
    return NextResponse.json(
      { error: `Failed to test platform: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}