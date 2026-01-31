import { NextResponse } from "next/server"
import { fetchGeeksforGeeksStats } from "@/lib/platforms/geeksforgeeks"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'test-user'
    
    console.log(`=== TESTING GEEKSFORGEEKS VERIFICATION ===`)
    console.log(`Testing username: ${username}`)
    
    // Test URL extraction first
    const testUrls = [
      'testuser',
      'https://auth.geeksforgeeks.org/user/testuser',
      'https://auth.geeksforgeeks.org/user/testuser/profile',
      'https://www.geeksforgeeks.org/user/testuser',
      'https://www.geeksforgeeks.org/user/testuser/profile'
    ]
    
    const extractionResults = []
    
    for (const testUrl of testUrls) {
      const stats = await fetchGeeksforGeeksStats(testUrl)
      extractionResults.push({
        input: testUrl,
        extracted: stats?.username || 'failed',
        success: !!stats
      })
    }
    
    const stats = await fetchGeeksforGeeksStats(username)
    
    return NextResponse.json({
      success: true,
      username,
      stats,
      extractionTests: extractionResults,
      message: stats ? 'Profile found' : 'Profile not found'
    })
    
  } catch (error) {
    console.error("GeeksforGeeks test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username } = body
    
    if (!username) {
      return NextResponse.json({
        success: false,
        error: 'Username is required'
      })
    }
    
    console.log(`=== TESTING GEEKSFORGEEKS VERIFICATION ===`)
    console.log(`Testing username: ${username}`)
    
    // Test URL extraction first
    let cleanUsername = username.trim()
    console.log(`Original input: "${username}"`)
    console.log(`Trimmed input: "${cleanUsername}"`)
    
    // Test URL extraction
    const urlPatterns = [
      /(?:https?:\/\/)?(?:auth\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)(?:\/profile)?/i,
      /(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)(?:\/profile)?/i,
      /(?:https?:\/\/)?(?:auth\.)?geeksforgeeks\.org\/profile\/([^\/\?\s]+)/i,
      /(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/profile\/([^\/\?\s]+)/i,
    ]
    
    let extractedUsername = cleanUsername
    for (const pattern of urlPatterns) {
      const match = cleanUsername.match(pattern)
      if (match) {
        extractedUsername = match[1]
        console.log(`URL pattern matched: ${pattern}`)
        console.log(`Extracted username: "${extractedUsername}"`)
        break
      }
    }
    
    if (extractedUsername === cleanUsername) {
      console.log('No URL pattern matched, using input as username')
    }
    
    const stats = await fetchGeeksforGeeksStats(extractedUsername)
    
    return NextResponse.json({
      success: true,
      originalInput: username,
      extractedUsername,
      stats,
      message: stats ? 'Profile found' : 'Profile not found'
    })
    
  } catch (error) {
    console.error("GeeksforGeeks test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}