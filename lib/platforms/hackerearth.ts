export interface HackerEarthStats {
  username: string
  name: string
  country: string
  school: string
  company: string
  avatar: string
  rating: number
  maxRating: number
  globalRank: number
  countryRank: number
  problemsSolved: number
  contests: {
    name: string
    rank: number
    score: number
    participants: number
  }[]
  badges: {
    name: string
    type: string
    earned_date: string
  }[]
  skills: string[]
  _apiLimited?: boolean
}

export async function fetchHackerEarthStats(username: string): Promise<HackerEarthStats | null> {
  try {
    // Clean the username (remove any URL parts)
    const cleanUsername = username.replace(/^https?:\/\/hackerearth\.com\//, '').replace(/\/$/, '').replace('@', '')
    
    console.log(`Fetching HackerEarth stats for: ${cleanUsername}`)
    
    // Method 1: Try HackerEarth API (if available)
    try {
      const apiResponse = await fetch(`https://www.hackerearth.com/api/user/${cleanUsername}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.hackerearth.com/',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        console.log('HackerEarth API response:', apiData)
        
        if (apiData.success && apiData.data) {
          const data = apiData.data
          return {
            username: cleanUsername,
            name: data.name || cleanUsername,
            country: data.country || '',
            school: data.school || '',
            company: data.company || '',
            avatar: data.avatar || '',
            rating: data.rating || 0,
            maxRating: data.max_rating || data.rating || 0,
            globalRank: data.global_rank || 0,
            countryRank: data.country_rank || 0,
            problemsSolved: data.problems_solved || 0,
            contests: data.contests || [],
            badges: data.badges || [],
            skills: data.skills || [],
          }
        }
      }
    } catch (apiError) {
      console.log('HackerEarth API method failed:', apiError)
    }

    // Method 2: Web scraping approach
    try {
      const profileUrl = `https://www.hackerearth.com/@${cleanUsername}/`
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: AbortSignal.timeout(15000),
      })

      if (response.ok) {
        const html = await response.text()
        
        // Check if profile exists (not 404 page)
        if (html.includes('Page not found') || html.includes('404') || html.includes('User not found')) {
          console.log(`HackerEarth profile not found for: ${cleanUsername}`)
          return null
        }
        
        // Extract data from HTML using regex patterns
        const nameMatch = html.match(/<title>([^|]+)\s*\|\s*HackerEarth/i) || html.match(/class="name"[^>]*>([^<]+)</i)
        const ratingMatch = html.match(/rating["\s]*:[\s]*(\d+)/i) || html.match(/class="rating"[^>]*>([^<]+)</i)
        const rankMatch = html.match(/rank["\s]*:[\s]*(\d+)/i) || html.match(/class="rank"[^>]*>([^<]+)</i)
        const problemsMatch = html.match(/problems["\s]*solved["\s]*:[\s]*(\d+)/i) || html.match(/(\d+)\s*problems?\s*solved/i)
        
        // Extract contests information
        const contestsMatch = html.match(/contests?["\s]*:[\s]*\[(.*?)\]/s)
        let contests = []
        if (contestsMatch) {
          try {
            const contestsStr = contestsMatch[1]
            const contestMatches = contestsStr.match(/{[^}]+}/g) || []
            contests = contestMatches.slice(0, 5).map(contest => {
              const nameMatch = contest.match(/name["\s]*:[\s]*"([^"]+)"/i)
              const rankMatch = contest.match(/rank["\s]*:[\s]*(\d+)/i)
              const scoreMatch = contest.match(/score["\s]*:[\s]*(\d+)/i)
              return {
                name: nameMatch ? nameMatch[1] : 'Contest',
                rank: rankMatch ? parseInt(rankMatch[1]) : 0,
                score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                participants: 0
              }
            })
          } catch (e) {
            console.log('Error parsing contests:', e)
          }
        }

        const name = nameMatch ? nameMatch[1].trim() : cleanUsername
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0
        const globalRank = rankMatch ? parseInt(rankMatch[1]) : 0
        const problemsSolved = problemsMatch ? parseInt(problemsMatch[1]) : 0

        console.log(`HackerEarth web scraping successful for ${cleanUsername}: rating ${rating}, ${problemsSolved} problems`)

        return {
          username: cleanUsername,
          name: name,
          country: '',
          school: '',
          company: '',
          avatar: '',
          rating: rating,
          maxRating: rating,
          globalRank: globalRank,
          countryRank: 0,
          problemsSolved: problemsSolved,
          contests: contests,
          badges: [],
          skills: [],
        }
      }
    } catch (scrapingError) {
      console.log(`HackerEarth web scraping failed: ${scrapingError}`)
    }

    // Method 3: Third-party APIs
    const thirdPartyApis = [
      `https://competitive-coding-api.herokuapp.com/api/hackerearth/${cleanUsername}`,
    ]

    for (const apiUrl of thirdPartyApis) {
      try {
        console.log(`Trying HackerEarth third-party API: ${apiUrl}`)
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; CodeTrack/1.0)",
          },
          signal: AbortSignal.timeout(8000),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`HackerEarth third-party API response:`, data)
          
          if (data.success !== false && !data.error) {
            return {
              username: cleanUsername,
              name: data.name || data.full_name || cleanUsername,
              country: data.country || '',
              school: data.school || '',
              company: data.company || '',
              avatar: data.avatar || '',
              rating: data.rating || 0,
              maxRating: data.max_rating || data.rating || 0,
              globalRank: data.rank || data.global_rank || 0,
              countryRank: data.country_rank || 0,
              problemsSolved: data.problems_solved || 0,
              contests: data.contests || [],
              badges: data.badges || [],
              skills: data.skills || [],
            }
          }
        }
      } catch (apiError) {
        console.log(`HackerEarth third-party API ${apiUrl} failed:`, apiError)
        continue
      }
    }

    // If all methods fail, return a basic profile to allow platform linking
    console.log(`All HackerEarth data sources failed for "${cleanUsername}", returning basic profile`)
    
    return {
      username: cleanUsername,
      name: cleanUsername,
      country: '',
      school: '',
      company: '',
      avatar: '',
      rating: 0,
      maxRating: 0,
      globalRank: 0,
      countryRank: 0,
      problemsSolved: 0,
      contests: [],
      badges: [],
      skills: [],
      _apiLimited: true,
    } as HackerEarthStats & { _apiLimited?: boolean }
  } catch (error) {
    console.error("Error fetching HackerEarth stats:", error)
    return null
  }
}