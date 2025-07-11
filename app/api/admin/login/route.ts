import { type NextRequest, NextResponse } from "next/server"

// In production, these should be environment variables
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "AmeriTrust2025!", // Change this to a secure password
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ADMIN LOGIN API START ===")

    // Parse request body safely
    let body: any = {}
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { username, password } = body

    console.log("Login attempt:", {
      username: username || "undefined",
      passwordProvided: !!password,
      passwordLength: password?.length || 0,
    })

    // Validate input
    if (!username || !password) {
      console.log("Missing credentials")
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Validate credentials (case-sensitive comparison)
    const isValidUsername = username.trim() === ADMIN_CREDENTIALS.username
    const isValidPassword = password === ADMIN_CREDENTIALS.password

    console.log("Credential validation:", {
      usernameMatch: isValidUsername,
      passwordMatch: isValidPassword,
      expectedUsername: ADMIN_CREDENTIALS.username,
      receivedUsername: username.trim(),
    })

    if (isValidUsername && isValidPassword) {
      console.log("✅ Login successful")

      // Create a simple token (in production, use proper JWT library)
      const tokenData = {
        username: username.trim(),
        role: "admin",
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        iat: Date.now(),
      }

      const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")

      const response = {
        success: true,
        token,
        user: {
          username: username.trim(),
          role: "admin",
        },
      }

      console.log("✅ Sending successful response")
      return NextResponse.json(response, { status: 200 })
    } else {
      console.log("❌ Invalid credentials")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("💥 Admin login error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

// Add GET method for health check
export async function GET() {
  try {
    return NextResponse.json({
      status: "Admin login API is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin login GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
