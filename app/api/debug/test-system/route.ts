import { NextResponse } from "next/server"
import { isDatabaseAvailable, getDatabase } from "@/lib/database"
import { Analytics } from "@/lib/analytics"
import { fetchLeetCodeStats } from "@/lib/platforms/leetcode"
import { fetchGitHubStats } from "@/lib/platforms/github"
import { fetchCodeforcesStats } from "@/lib/platforms/codeforces"

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as Array<{
      name: string
      status: 'PASS' | 'FAIL' | 'WARN'
      message: string
      details?: any
    }>
  }

  // Test 1: Database Connection
  try {
    const dbAvailable = isDatabaseAvailable()
    if (dbAvailable) {
      const db = await getDatabase()
      await db.admin().ping()
      results.tests.push({
        name: "Database Connection",
        status: "PASS",
        message: "MongoDB connection successful"
      })
    } else {
      results.tests.push({
        name: "Database Connection",
        status: "WARN",
        message: "Database not configured, using fallback mode"
      })
    }
  } catch (error) {
    results.tests.push({
      name: "Database Connection",
      status: "FAIL",
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  // Test 2: Analytics System
  try {
    await Analytics.track({
      type: 'custom',
      action: 'system_test',
      metadata: { test: true }
    })
    
    const analytics = await Analytics.getAnalytics('today')
    results.tests.push({
      name: "Analytics System",
      status: "PASS",
      message: "Analytics tracking and retrieval working",
      details: {
        totalEvents: analytics.summary.totalEvents,
        hasRecentActivity: analytics.recentActivity.length > 0
      }
    })
  } catch (error) {
    results.tests.push({
      name: "Analytics System",
      status: "FAIL",
      message: `Analytics system failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  // Test 3: Platform Integrations (Sample)
  try {
    // Test LeetCode (using a known public profile)
    const leetcodeStats = await fetchLeetCodeStats("tourist")
    results.tests.push({
      name: "LeetCode Integration",
      status: leetcodeStats ? "PASS" : "WARN",
      message: leetcodeStats ? "LeetCode API working" : "LeetCode API returned null (user not found or API issue)",
      details: leetcodeStats ? {
        totalSolved: leetcodeStats.totalSolved,
        ranking: leetcodeStats.ranking
      } : null
    })
  } catch (error) {
    results.tests.push({
      name: "LeetCode Integration",
      status: "FAIL",
      message: `LeetCode API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  try {
    // Test GitHub (using a known public profile)
    const githubStats = await fetchGitHubStats("torvalds")
    results.tests.push({
      name: "GitHub Integration",
      status: githubStats ? "PASS" : "WARN",
      message: githubStats ? "GitHub API working" : "GitHub API returned null",
      details: githubStats ? {
        publicRepos: githubStats.publicRepos,
        followers: githubStats.followers
      } : null
    })
  } catch (error) {
    results.tests.push({
      name: "GitHub Integration",
      status: "FAIL",
      message: `GitHub API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  try {
    // Test Codeforces (using a known public profile)
    const codeforcesStats = await fetchCodeforcesStats("tourist")
    results.tests.push({
      name: "Codeforces Integration",
      status: codeforcesStats ? "PASS" : "WARN",
      message: codeforcesStats ? "Codeforces API working" : "Codeforces API returned null",
      details: codeforcesStats ? {
        rating: codeforcesStats.rating,
        problemsSolved: codeforcesStats.problemsSolved
      } : null
    })
  } catch (error) {
    results.tests.push({
      name: "Codeforces Integration",
      status: "FAIL",
      message: `Codeforces API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  // Test 4: Environment Variables
  const envTests = [
    { name: 'MONGODB_URI', value: process.env.MONGODB_URI },
    { name: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET },
    { name: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL },
  ]

  envTests.forEach(({ name, value }) => {
    if (!value) {
      results.tests.push({
        name: `Environment Variable: ${name}`,
        status: "WARN",
        message: `${name} is not set`
      })
    } else if (value.includes('your-') || value.includes('change-in-production')) {
      results.tests.push({
        name: `Environment Variable: ${name}`,
        status: "WARN",
        message: `${name} appears to be using default/placeholder value`
      })
    } else {
      results.tests.push({
        name: `Environment Variable: ${name}`,
        status: "PASS",
        message: `${name} is configured`
      })
    }
  })

  // Calculate overall status
  const failCount = results.tests.filter(t => t.status === 'FAIL').length
  const warnCount = results.tests.filter(t => t.status === 'WARN').length
  const passCount = results.tests.filter(t => t.status === 'PASS').length

  const overallStatus = failCount > 0 ? 'CRITICAL_ISSUES' : 
                       warnCount > 0 ? 'MINOR_ISSUES' : 'ALL_SYSTEMS_GO'

  return NextResponse.json({
    overallStatus,
    summary: {
      total: results.tests.length,
      passed: passCount,
      warnings: warnCount,
      failed: failCount
    },
    ...results,
    recommendations: generateRecommendations(results.tests)
  })
}

function generateRecommendations(tests: Array<{ name: string; status: string; message: string }>) {
  const recommendations = []

  const failedTests = tests.filter(t => t.status === 'FAIL')
  const warnTests = tests.filter(t => t.status === 'WARN')

  if (failedTests.length > 0) {
    recommendations.push("🔴 CRITICAL: Fix failed tests immediately")
    failedTests.forEach(test => {
      recommendations.push(`   - ${test.name}: ${test.message}`)
    })
  }

  if (warnTests.length > 0) {
    recommendations.push("⚠️ WARNINGS: Address these for optimal performance")
    warnTests.forEach(test => {
      recommendations.push(`   - ${test.name}: ${test.message}`)
    })
  }

  if (failedTests.length === 0 && warnTests.length === 0) {
    recommendations.push("✅ All systems operational!")
  }

  return recommendations
}