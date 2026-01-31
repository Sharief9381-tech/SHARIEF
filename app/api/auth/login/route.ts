import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { Analytics, getVisitorInfo } from "@/lib/analytics"
import type { UserRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    console.log("=== LOGIN API CALLED ===")
    
    const body = await request.json()
    const { email, password } = body

    console.log("1. Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("2. Checking database availability...")
    const dbAvailable = isDatabaseAvailable()
    
    if (!dbAvailable) {
      console.log("3. Database not available, redirecting to fallback...")
      // Forward the request to the fallback API
      const fallbackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/login-fallback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const fallbackData = await fallbackResponse.json()
      return NextResponse.json(fallbackData, { status: fallbackResponse.status })
    }

    console.log("3. Database available, using MongoDB...")
    
    // Import database functions only when database is available
    const { findUserByEmail, verifyPassword, createSession } = await import("@/lib/auth")
    const { cookies } = await import("next/headers")

    const user = await findUserByEmail(email)
    console.log("4. User found:", user ? "Yes" : "No")
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password as string)
    console.log("5. Password valid:", isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await createSession(user._id as string, user.role as UserRole)
    console.log("6. Session created, redirecting to:", `/${user.role}/dashboard`)

    const cookieStore = await cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Track login event
    const visitorInfo = getVisitorInfo(request)
    await Analytics.track({
      type: 'user_login',
      userId: user._id?.toString(),
      userRole: user.role,
      metadata: { 
        email: user.email,
        name: user.name
      }
    }, visitorInfo)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo: `/${user.role}/dashboard`,
    })
  } catch (error) {
    console.error("=== LOGIN ERROR ===", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}
