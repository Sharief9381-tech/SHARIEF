import { NextResponse } from "next/server"
import { fetchAtCoderStats } from "@/lib/platforms/atcoder"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'shariefsk95'
    
    console.log(`=== TESTING REAL ATCODER STATS FOR: ${username} ===`)
    
    const stats = await fetchAtCoderStats(username)
    
    console.log("AtCoder stats result:", stats)
    
    return NextResponse.json({
      success: true,
      username: username,
      profileUrl: `https://atcoder.jp/users/${username}`,
      stats: stats,
      isReal: true,
      explanation: stats ? 
        "Successfully fetched real AtCoder stats. If rating and problems are 0, this means the user is unrated/hasn't solved problems in rated contests." :
        "Profile not found or unable to fetch stats - this is correct behavior, no fake data generated."
    })
    
  } catch (error) {
    console.error("Test AtCoder error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        explanation: "Error occurred while testing AtCoder fetcher"
      },
      { status: 500 }
    )
  }
}