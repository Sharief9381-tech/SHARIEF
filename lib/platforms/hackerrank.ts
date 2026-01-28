export interface HackerRankStats {
  username: string
  name: string
  country: string
  school: string
  company: string
  avatar: string
  level: number
  badges: {
    name: string
    level: string
    badge_type: string
    earned_date: string
  }[]
  certifications: {
    name: string
    level: string
    issued_date: string
    certificate_url: string
  }[]
  skills: {
    name: string
    level: number
    max_score: number
    score: number
    percentage: number
    stars: number
  }[]
  contests: {
    name: string
    rank: number
    score: number
    participants: number
  }[]
  totalScore: number
  globalRank: number
  countryRank: number
}

export async function fetchHackerRankStats(username: string): Promise<HackerRankStats | null> {
  try {
    // Clean the username (remove any URL parts)
    const cleanUsername = username.replace(/^https?:\/\/hackerrank\.com\//, '').replace(/\/$/, '')
    
    console.log(`Fetching HackerRank stats for: ${cleanUsername}`)
    
    // Try multiple approaches to get HackerRank data
    
    // Method 1: Try HackerRank API (if available)
    try {
      const apiResponse = await fetch(`https://www.hackerrank.com/rest/hackers/${cleanUsername}/recent_challenges?limit=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.hackerrank.com/',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        console.log('HackerRank API response:', apiData)
        
        // If API works, fetch more detailed data
        const profileResponse = await fetch(`https://www.hackerrank.com/rest/hackers/${cleanUsername}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Referer': 'https://www.hackerrank.com/',
          },
          signal: AbortSignal.timeout(10000),
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          console.log('HackerRank profile data:', profileData)
          
          return {
            username: cleanUsername,
            name: profileData.model?.name || cleanUsername,
            country: profileData.model?.country || '',
            school: profileData.model?.school || '',
            company: profileData.model?.company || '',
            avatar: profileData.model?.avatar || '',
            level: profileData.model?.level || 0,
            badges: profileData.model?.badges || [],
            certifications: profileData.model?.certifications || [],
            skills: profileData.model?.skills || [],
            contests: profileData.model?.contests || [],
            totalScore: profileData.model?.score || 0,
            globalRank: profileData.model?.rank || 0,
            countryRank: profileData.model?.country_rank || 0,
          }
        }
      }
    } catch (apiError) {
      console.log('HackerRank API method failed:', apiError)
    }

    // Method 2: Web scraping approach
    try {
      const profileUrl = `https://www.hackerrank.com/${cleanUsername}`
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
        
        // Extract data from HTML using regex patterns
        const nameMatch = html.match(/<title>([^|]+)\s*\|\s*HackerRank/i)
        const levelMatch = html.match(/level["\s]*:[\s]*(\d+)/i)
        const scoreMatch = html.match(/score["\s]*:[\s]*(\d+)/i)
        const rankMatch = html.match(/rank["\s]*:[\s]*(\d+)/i)
        
        // Extract badges information
        const badgesMatch = html.match(/badges["\s]*:[\s]*\[(.*?)\]/s)
        let badges = []
        if (badgesMatch) {
          try {
            const badgesStr = badgesMatch[1]
            // Parse badges from the extracted string
            const badgeMatches = badgesStr.match(/{[^}]+}/g) || []
            badges = badgeMatches.map(badge => {
              const nameMatch = badge.match(/name["\s]*:[\s]*"([^"]+)"/i)
              const levelMatch = badge.match(/level["\s]*:[\s]*"([^"]+)"/i)
              return {
                name: nameMatch ? nameMatch[1] : 'Unknown Badge',
                level: levelMatch ? levelMatch[1] : 'Bronze',
                badge_type: 'skill',
                earned_date: new Date().toISOString()
              }
            })
          } catch (e) {
            console.log('Error parsing badges:', e)
          }
        }

        // Extract skills information
        const skillsMatch = html.match(/skills["\s]*:[\s]*\[(.*?)\]/s)
        let skills = []
        if (skillsMatch) {
          try {
            const skillsStr = skillsMatch[1]
            const skillMatches = skillsStr.match(/{[^}]+}/g) || []
            skills = skillMatches.map(skill => {
              const nameMatch = skill.match(/name["\s]*:[\s]*"([^"]+)"/i)
              const scoreMatch = skill.match(/score["\s]*:[\s]*(\d+)/i)
              const maxScoreMatch = skill.match(/max_score["\s]*:[\s]*(\d+)/i)
              
              const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
              const maxScore = maxScoreMatch ? parseInt(maxScoreMatch[1]) : 100
              const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
              const stars = Math.floor(percentage / 20) // 5-star system
              
              return {
                name: nameMatch ? nameMatch[1] : 'Unknown Skill',
                level: Math.floor(score / 20),
                max_score: maxScore,
                score: score,
                percentage: percentage,
                stars: Math.min(stars, 5)
              }
            })
          } catch (e) {
            console.log('Error parsing skills:', e)
          }
        }

        const name = nameMatch ? nameMatch[1].trim() : cleanUsername
        const level = levelMatch ? parseInt(levelMatch[1]) : 0
        const totalScore = scoreMatch ? parseInt(scoreMatch[1]) : 0
        const globalRank = rankMatch ? parseInt(rankMatch[1]) : 0

        console.log(`HackerRank web scraping successful for ${cleanUsername}: ${badges.length} badges, ${skills.length} skills, level ${level}`)

        return {
          username: cleanUsername,
          name: name,
          country: '',
          school: '',
          company: '',
          avatar: '',
          level: level,
          badges: badges,
          certifications: [],
          skills: skills,
          contests: [],
          totalScore: totalScore,
          globalRank: globalRank,
          countryRank: 0,
        }
      }
    } catch (scrapingError) {
      console.log(`HackerRank web scraping failed: ${scrapingError}`)
    }

    // Method 3: Third-party APIs
    const thirdPartyApis = [
      `https://competitive-coding-api.herokuapp.com/api/hackerrank/${cleanUsername}`,
      `https://hackerrank-api.vercel.app/api/${cleanUsername}`,
    ]

    for (const apiUrl of thirdPartyApis) {
      try {
        console.log(`Trying HackerRank third-party API: ${apiUrl}`)
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; CodeTrack/1.0)",
          },
          signal: AbortSignal.timeout(8000),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`HackerRank third-party API response:`, data)
          
          if (data.success !== false && !data.error) {
            return {
              username: cleanUsername,
              name: data.name || data.full_name || cleanUsername,
              country: data.country || '',
              school: data.school || '',
              company: data.company || '',
              avatar: data.avatar || '',
              level: data.level || 0,
              badges: data.badges || [],
              certifications: data.certifications || [],
              skills: data.skills || [],
              contests: data.contests || [],
              totalScore: data.score || data.total_score || 0,
              globalRank: data.rank || data.global_rank || 0,
              countryRank: data.country_rank || 0,
            }
          }
        }
      } catch (apiError) {
        console.log(`HackerRank third-party API ${apiUrl} failed:`, apiError)
        continue
      }
    }

    // If all methods fail, return a basic profile to allow platform linking
    console.log(`All HackerRank data sources failed for "${cleanUsername}", returning basic profile`)
    
    return {
      username: cleanUsername,
      name: cleanUsername,
      country: '',
      school: '',
      company: '',
      avatar: '',
      level: 0,
      badges: [],
      certifications: [],
      skills: [],
      contests: [],
      totalScore: 0,
      globalRank: 0,
      countryRank: 0,
      _apiLimited: true,
    } as HackerRankStats & { _apiLimited?: boolean }
  } catch (error) {
    console.error("Error fetching HackerRank stats:", error)
    return null
  }
}