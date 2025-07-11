import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all email-related environment variables
    const config = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      EMAIL_API_KEY_EXISTS: !!process.env.EMAIL_API_KEY,
      EMAIL_API_KEY_PREFIX: process.env.EMAIL_API_KEY?.substring(0, 8) + "...",
      EMAIL_FROM: process.env.EMAIL_FROM,
      RESEND_OWNER_EMAIL: process.env.RESEND_OWNER_EMAIL,
      // Check if we can import the email service
      canImportEmailService: false,
    }

    // Try to import and check email service
    try {
      const { emailServiceAPI } = await import("@/lib/email-services")
      config.canImportEmailService = true

      // Get sandbox info
      const sandboxInfo = emailServiceAPI.getSandboxInfo()

      return NextResponse.json({
        message: "Email configuration debug info",
        config,
        sandboxInfo,
        timestamp: new Date().toISOString(),
      })
    } catch (importError) {
      return NextResponse.json({
        message: "Email configuration debug info",
        config,
        importError: importError.message,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
