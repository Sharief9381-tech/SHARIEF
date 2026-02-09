import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    
    // Only allow admin users
    if (!currentUser || (currentUser.role !== "admin" && currentUser.email !== "admin@codetrack.com")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      )
    }

    let user = null

    // Try to fetch from database first
    if (isDatabaseAvailable()) {
      try {
        const db = await getDatabase()
        user = await db.collection('users').findOne({ email: email })
        
        if (user) {
          // Convert MongoDB _id to string
          user._id = user._id?.toString()
        }
      } catch (error) {
        console.error("Database query error:", error)
      }
    }

    // If not found in database, try fallback auth
    if (!user) {
      const { findUserByEmail } = await import("@/lib/auth-fallback")
      user = await findUserByEmail(email)
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error("User details API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    )
  }
}
