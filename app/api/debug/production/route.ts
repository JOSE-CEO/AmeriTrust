import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== PRODUCTION DEBUG START ===")

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
      },
      emailConfig: {
        EMAIL_SERVICE: process.env.EMAIL_SERVICE,
        EMAIL_API_KEY_EXISTS: !!process.env.EMAIL_API_KEY,
        EMAIL_API_KEY_LENGTH: process.env.EMAIL_API_KEY?.length || 0,
        EMAIL_API_KEY_PREFIX: process.env.EMAIL_API_KEY?.substring(0, 10) + "...",
        EMAIL_FROM: process.env.EMAIL_FROM,
        RESEND_OWNER_EMAIL: process.env.RESEND_OWNER_EMAIL,
      },
      tests: {
        canImportEmailService: false,
        emailServiceError: null,
        sandboxInfo: null,
      },
    }

    // Test email service import
    try {
      const { emailServiceAPI } = await import("@/lib/email-services")
      debugInfo.tests.canImportEmailService = true
      debugInfo.tests.sandboxInfo = emailServiceAPI.getSandboxInfo()
    } catch (importError) {
      debugInfo.tests.emailServiceError = importError.message
    }

    console.log("Debug info:", debugInfo)

    return NextResponse.json(debugInfo)
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
