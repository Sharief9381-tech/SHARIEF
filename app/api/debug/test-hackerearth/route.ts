import { NextResponse } from "next/server"
import { fetchHackerEarthStats } from "@/lib/platforms/hackerearth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'shariefsk95'
    
    console.log(`=== TESTING HACKEREARTH FOR: ${username} ===`)
    
    // Test the URL parsing first
    const testUrl = "https://www.hackerearth.com/@shariefsk95/"
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?hackerearth\.com\/@?([^\/\s]+)/i
    const match = testUrl.match(urlPattern)
    
    console.log('URL Pattern Test:')
    console.log('Input URL:', testUrl)
    console.log('Pattern:', urlPattern)
    console.log('Match result:', match)
    console.log('Extracted username:', match ? match[1] : 'No match')
    
    // Test the actual fetcher
    const stats = await fetchHackerEarthStats(username)
    console.log("HackerEarth stats result:", stats)
    
    // Test direct URL access
    const profileUrl = `https://www.hackerearth.com/@${username}/`
    console.log('Testing profile URL:', profileUrl)
    
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(15000)
      })
      
      console.log('Direct fetch response status:', response.status)
      console.log('Direct fetch response ok:', response.ok)
      
      if (response.ok) {
        const html = await response.text()
        console.log('HTML length:', html.length)
        console.log('HTML contains "Page not found":', html.includes('Page not found'))
        console.log('HTML contains "404":', html.includes('404'))
        console.log('HTML contains "User not found":', html.includes('User not found'))
        console.log('HTML contains "does not exist":', html.toLowerCase().includes('does not exist'))
        console.log('HTML contains "not found":', html.toLowerCase().includes('not found'))
        
        // Check for profile indicators
        console.log('HTML contains profile indicators:')
        console.log('- Contains "profile":', html.toLowerCase().includes('profile'))
        console.log('- Contains username:', html.includes(username))
        console.log('- Contains "hackerearth":', html.toLowerCase().includes('hackerearth'))
        console.log('- Contains "rating":', html.toLowerCase().includes('rating'))
        console.log('- Contains "problems":', html.toLowerCase().includes('problems'))
        console.log('- Contains "solved":', html.toLowerCase().includes('solved'))
        
        // Check for specific error patterns
        console.log('Error pattern checks:')
        console.log('- Contains "error":', html.toLowerCase().includes('error'))
        console.log('- Contains "invalid":', html.toLowerCase().includes('invalid'))
        console.log('- Contains "unavailable":', html.toLowerCase().includes('unavailable'))
        
        // Show title tag content
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        console.log('Page title:', titleMatch ? titleMatch[1] : 'No title found')
      }
    } catch (fetchError) {
      console.log('Direct fetch error:', fetchError)
    }
    
    return NextResponse.json({
      success: true,
      username: username,
      profileUrl: profileUrl,
      urlParsingTest: {
        inputUrl: testUrl,
        extractedUsername: match ? match[1] : null,
        patternWorked: !!match
      },
      stats: stats,
      isReal: true,
      explanation: stats ? 
        `Successfully fetched HackerEarth stats. Rating: ${stats.rating}, Problems: ${stats.problemsSolved}` :
        "Profile not found or unable to fetch stats - this might be a real issue with the profile URL or HackerEarth access"
    })
    
  } catch (error) {
    console.error("Test HackerEarth error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        explanation: "Error occurred while testing HackerEarth fetcher"
      },
      { status: 500 }
    )
  }
}