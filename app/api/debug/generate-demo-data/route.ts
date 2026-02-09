import { NextResponse } from "next/server"
import { Analytics } from "@/lib/analytics"
import { createStudent, createCollege, createRecruiter } from "@/lib/auth"

export async function POST() {
  try {
    const results = {
      users: [] as any[],
      analytics: [] as any[],
      errors: [] as string[]
    }

    // Create demo users
    const demoUsers = [
      {
        type: 'student',
        data: {
          name: "Alex Chen",
          email: "alex.chen@demo.com",
          password: "password123",
          role: "student" as const,
          collegeName: "MIT",
          graduationYear: 2025,
          branch: "Computer Science",
          linkedPlatforms: {
            leetcode: "alexchen",
            github: "alexchen-dev",
            codeforces: "alexchen"
          },
          stats: {
            totalProblems: 150,
            easyProblems: 60,
            mediumProblems: 70,
            hardProblems: 20,
            githubContributions: 250,
            contestsParticipated: 15,
            rating: 1650,
          },
          skills: ["JavaScript", "Python", "React", "Node.js"],
          isOpenToWork: true,
        }
      },
      {
        type: 'student',
        data: {
          name: "Priya Sharma",
          email: "priya.sharma@demo.com",
          password: "password123",
          role: "student" as const,
          collegeName: "Stanford",
          graduationYear: 2024,
          branch: "Computer Science",
          linkedPlatforms: {
            leetcode: "priyasharma",
            github: "priya-codes",
            codechef: "priya_chef"
          },
          stats: {
            totalProblems: 200,
            easyProblems: 80,
            mediumProblems: 90,
            hardProblems: 30,
            githubContributions: 180,
            contestsParticipated: 20,
            rating: 1800,
          },
          skills: ["Java", "Python", "Spring Boot", "MySQL"],
          isOpenToWork: true,
        }
      },
      {
        type: 'college',
        data: {
          name: "MIT Placement Office",
          email: "placement@mit.edu",
          password: "password123",
          role: "college" as const,
          collegeName: "Massachusetts Institute of Technology",
          collegeCode: "MIT",
          location: "Cambridge, MA",
          website: "https://mit.edu",
          placementOfficerName: "Dr. Sarah Johnson",
          placementOfficerEmail: "sarah.johnson@mit.edu",
          totalStudents: 1200,
          departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
        }
      },
      {
        type: 'recruiter',
        data: {
          name: "John Smith",
          email: "john.smith@techcorp.com",
          password: "password123",
          role: "recruiter" as const,
          companyName: "TechCorp Inc",
          companyWebsite: "https://techcorp.com",
          companySize: "1000-5000",
          industry: "Technology",
          designation: "Senior Technical Recruiter",
          hiringFor: ["Software Engineer", "Full Stack Developer", "Data Scientist"],
          preferredSkills: ["JavaScript", "Python", "React", "Node.js", "AWS"],
        }
      }
    ]

    // Create users
    for (const user of demoUsers) {
      try {
        let createdUser
        if (user.type === 'student') {
          createdUser = await createStudent(user.data)
        } else if (user.type === 'college') {
          createdUser = await createCollege(user.data)
        } else if (user.type === 'recruiter') {
          createdUser = await createRecruiter(user.data)
        }

        if (createdUser) {
          results.users.push({
            type: user.type,
            id: createdUser._id,
            email: createdUser.email,
            name: createdUser.name
          })
        }
      } catch (error) {
        results.errors.push(`Failed to create ${user.type} user: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Generate demo analytics events
    const analyticsEvents = [
      { type: 'page_view' as const, page: '/', userRole: 'student' },
      { type: 'page_view' as const, page: '/login', userRole: undefined },
      { type: 'user_signup' as const, userRole: 'student' },
      { type: 'user_login' as const, userRole: 'student' },
      { type: 'page_view' as const, page: '/student/dashboard', userRole: 'student' },
      { type: 'page_view' as const, page: '/student/platforms', userRole: 'student' },
      { type: 'platform_link' as const, action: 'leetcode_connected', userRole: 'student' },
      { type: 'page_view' as const, page: '/college/dashboard', userRole: 'college' },
      { type: 'user_login' as const, userRole: 'college' },
      { type: 'page_view' as const, page: '/recruiter/search', userRole: 'recruiter' },
      { type: 'user_signup' as const, userRole: 'recruiter' },
      { type: 'page_view' as const, page: '/admin', userRole: 'college' },
    ]

    for (const event of analyticsEvents) {
      try {
        await Analytics.track(event, {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Demo Data Generator)'
        })
        results.analytics.push(event)
      } catch (error) {
        results.errors.push(`Failed to track analytics event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo data generated successfully",
      results,
      summary: {
        usersCreated: results.users.length,
        analyticsEventsCreated: results.analytics.length,
        errors: results.errors.length
      }
    })
  } catch (error) {
    console.error("Generate demo data error:", error)
    return NextResponse.json(
      { error: "Failed to generate demo data: " + (error as Error).message },
      { status: 500 }
    )
  }
}