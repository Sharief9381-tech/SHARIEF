import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Return the raw linkedPlatforms data to debug
    return NextResponse.json({
      userId: user._id,
      linkedPlatforms: user.linkedPlatforms,
      linkedPlatformsType: typeof user.linkedPlatforms,
      linkedPlatformsKeys: user.linkedPlatforms ? Object.keys(user.linkedPlatforms) : [],
      linkedPlatformsEntries: user.linkedPlatforms ? Object.entries(user.linkedPlatforms) : [],
      rawUser: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        linkedPlatforms: user.linkedPlatforms
      }
    })
  } catch (error) {
    console.error("Debug platforms error:", error)
    return NextResponse.json(
      { error: "Failed to get debug info" },
      { status: 500 }
    )
  }
}