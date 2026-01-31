import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== "college") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get college information
    const college = user as any
    const collegeName = college.collegeName
    const collegeCode = college.collegeCode

    if (!collegeCode) {
      return NextResponse.json(
        { error: "College code not found" },
        { status: 400 }
      )
    }

    console.log(`Fetching dashboard data for college: ${collegeName} (${collegeCode})`)

    let students = []

    if (isDatabaseAvailable()) {
      // Use database
      students = await UserModel.findAll({ 
        role: 'student',
        collegeCode: collegeCode
      })
    } else {
      // Use fallback system
      const { getUsers } = await import("@/lib/auth-fallback")
      const allUsers = await getUsers()
      
      students = allUsers.filter((student: any) => {
        return student.role === 'student' && student.collegeCode === collegeCode
      })
    }

    // Calculate dashboard statistics
    const totalStudents = students.length
    const activeStudents = students.filter((s: any) => 
      s.linkedPlatforms && Object.keys(s.linkedPlatforms).length > 0
    ).length

    // Calculate aggregated statistics
    let totalProblems = 0
    let totalContributions = 0
    let totalContests = 0
    let totalRating = 0
    let studentsWithStats = 0

    // Department breakdown
    const departmentStats: Record<string, any> = {}
    
    // Top performers
    const topPerformers: any[] = []

    // Placement statistics
    const placedStudents = students.filter((s: any) => s.placementStatus === 'placed').length
    const interviewingStudents = students.filter((s: any) => s.placementStatus === 'interviewing').length
    const searchingStudents = students.filter((s: any) => s.placementStatus === 'searching').length

    students.forEach((student: any) => {
      // Department statistics
      const dept = student.branch || 'Unknown'
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          name: dept,
          students: 0,
          totalProblems: 0,
          totalContributions: 0,
          totalRating: 0,
          placed: 0,
          interviewing: 0,
          searching: 0
        }
      }
      
      departmentStats[dept].students++
      
      if (student.placementStatus === 'placed') departmentStats[dept].placed++
      else if (student.placementStatus === 'interviewing') departmentStats[dept].interviewing++
      else departmentStats[dept].searching++

      // Aggregate statistics
      if (student.aggregatedStats) {
        const stats = student.aggregatedStats
        totalProblems += stats.totalProblems || 0
        totalContributions += stats.githubContributions || 0
        totalContests += stats.contestsAttended || 0
        totalRating += stats.currentRating || 0
        studentsWithStats++

        // Department aggregation
        departmentStats[dept].totalProblems += stats.totalProblems || 0
        departmentStats[dept].totalContributions += stats.githubContributions || 0
        departmentStats[dept].totalRating += stats.currentRating || 0

        // Top performers
        topPerformers.push({
          id: student._id,
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber || 'N/A',
          branch: student.branch || 'Unknown',
          totalProblems: stats.totalProblems || 0,
          githubContributions: stats.githubContributions || 0,
          contestsAttended: stats.contestsAttended || 0,
          currentRating: stats.currentRating || 0,
          overallRank: stats.skillsAnalysis?.overallRank || 'Beginner',
          activityLevel: stats.skillsAnalysis?.activityLevel || 'Low',
          placementStatus: student.placementStatus || 'searching'
        })
      }
    })

    // Calculate averages for departments
    Object.keys(departmentStats).forEach(dept => {
      const stats = departmentStats[dept]
      stats.avgProblems = stats.students > 0 ? Math.round(stats.totalProblems / stats.students) : 0
      stats.avgContributions = stats.students > 0 ? Math.round(stats.totalContributions / stats.students) : 0
      stats.avgRating = stats.students > 0 ? Math.round(stats.totalRating / stats.students) : 0
      stats.placementRate = stats.students > 0 ? Math.round((stats.placed / stats.students) * 100) : 0
    })

    // Sort top performers by total score
    topPerformers.sort((a, b) => {
      const scoreA = (a.totalProblems * 2) + Math.floor(a.githubContributions / 10) + (a.contestsAttended * 5)
      const scoreB = (b.totalProblems * 2) + Math.floor(b.githubContributions / 10) + (b.contestsAttended * 5)
      return scoreB - scoreA
    })

    // Recent activity (simulated - would need historical data)
    const recentActivity = [
      {
        type: 'student_joined',
        message: `New student registered`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'platform_linked',
        message: `Student linked LeetCode account`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'achievement',
        message: `Student solved 100+ problems`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({
      college: {
        name: collegeName,
        code: collegeCode,
        location: college.location
      },
      overview: {
        totalStudents,
        activeStudents,
        registrationRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0,
        avgProblems: studentsWithStats > 0 ? Math.round(totalProblems / studentsWithStats) : 0,
        avgContributions: studentsWithStats > 0 ? Math.round(totalContributions / studentsWithStats) : 0,
        avgRating: studentsWithStats > 0 ? Math.round(totalRating / studentsWithStats) : 0,
        placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0
      },
      placement: {
        total: totalStudents,
        placed: placedStudents,
        interviewing: interviewingStudents,
        searching: searchingStudents,
        placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0
      },
      departments: Object.values(departmentStats),
      topPerformers: topPerformers.slice(0, 10),
      recentActivity,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("Get college dashboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}