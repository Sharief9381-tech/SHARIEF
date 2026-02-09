import { NextResponse } from "next/server"
import { findUserByEmail, verifyPassword, createSession } from "@/lib/auth-fallback"
import type { UserRole } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Fallback login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(email)
    console.log("User found:", user ? "Yes" : "No")
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password as string)
    console.log("Password valid:", isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await createSession(user._id as string, user.role as UserRole)
    
    // Determine redirect URL - admin users go to admin portal
    const redirectTo = user.email === "sharief9381@gmail.com" ? "/admin" : `/${user.role}/dashboard`
    console.log("Session created, redirecting to:", redirectTo)

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

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo: redirectTo,
      message: "Login successful (using fallback storage)"
    })
  } catch (error) {
    console.error("Fallback login error:", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}