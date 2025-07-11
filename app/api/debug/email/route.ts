import { NextResponse } from "next/server"

export async function GET() {
  try {
    const config = {
      NODE_ENV: process.env.NODE_ENV,
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      EMAIL_API_KEY_EXISTS: !!process.env.EMAIL_API_KEY,
      EMAIL_API_KEY_LENGTH: process.env.EMAIL_API_KEY?.length || 0,
      EMAIL_FROM: process.env.EMAIL_FROM,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    console.log("Email Debug Info:", config)

    return NextResponse.json({
      message: "Email configuration debug info",
      config,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
