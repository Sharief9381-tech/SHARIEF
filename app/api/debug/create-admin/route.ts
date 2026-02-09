import { NextResponse } from "next/server"
import { createCollege } from "@/lib/auth"

export async function POST() {
  try {
    // Create admin user (using college role since admin check is email-based)
    const admin = await createCollege({
      name: "System Administrator",
      email: "admin@codetrack.com",
      password: "admin123",
      role: "college",
      collegeName: "CodeTrack System",
      collegeCode: "ADMIN",
      location: "System",
      website: "https://codetrack.com",
      placementOfficerName: "System Admin",
      placementOfficerEmail: "admin@codetrack.com",
      totalStudents: 0,
      departments: ["System Administration"],
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      admin: { 
        id: admin._id, 
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      credentials: {
        email: "admin@codetrack.com",
        password: "admin123"
      },
      accessUrls: {
        admin: "/admin",
        collegeAnalytics: "/college/website-analytics"
      }
    })
  } catch (error) {
    console.error("Create admin user error:", error)
    return NextResponse.json(
      { error: "Failed to create admin user: " + (error as Error).message },
      { status: 500 }
    )
  }
}