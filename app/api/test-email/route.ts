import { type NextRequest, NextResponse } from "next/server"
import { sendTestEmail, sendAdminNotification } from "@/lib/email-services"

export async function GET() {
  return NextResponse.json({
    message: "Email Test API - Use POST to send test emails",
    endpoints: {
      "POST /api/test-email": "Send test emails",
      "Available tests": ["admin", "customer", "simple"],
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email } = body

    console.log("🧪 Email test request:", { type, email })

    const results: any = {
      timestamp: new Date().toISOString(),
      testType: type,
      results: {},
    }

    switch (type) {
      case "admin":
        console.log("🧪 Testing admin notification...")

        const mockQuoteData = {
          id: Date.now().toString(),
          firstName: "Test",
          lastName: "Customer",
          email: email || "test@example.com",
          phone: "(555) 123-4567",
          serviceType: "auto",
          currentInsurer: "State Farm",
          message: "This is a test quote request for email testing purposes.",
          driverName: "Test Driver",
          driverDateOfBirth: "1990-01-01",
          driverLicenseNo: "TEST123456",
          vehicleYear: "2020",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          address: "123 Test Street, Test City, TS 12345",
          submittedAt: new Date().toISOString(),
        }

        const adminResult = await sendAdminNotification(mockQuoteData)
        results.results.adminNotification = adminResult
        break

      case "simple":
        console.log("🧪 Testing simple email...")

        const testEmail = email || "test@example.com"
        const testSubject = "🧪 AmeriTrust Insurance - Email Test"
        const testContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #16a34a;">Email Test Successful! ✅</h1>
            <p>This is a test email from AmeriTrust Insurance.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Test Type:</strong> Simple Email Test</p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p>If you received this email, the email service is working correctly!</p>
            </div>
            <p style="color: #666; font-size: 12px;">
              This is an automated test email from AmeriTrust Insurance email system.
            </p>
          </div>
        `

        const simpleResult = await sendTestEmail(testEmail, testSubject, testContent)
        results.results.simpleEmail = {
          success: simpleResult,
          recipient: testEmail,
          subject: testSubject,
        }
        break

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid test type",
            availableTypes: ["admin", "simple"],
          },
          { status: 400 },
        )
    }

    console.log("🧪 Test results:", results)

    return NextResponse.json({
      success: true,
      message: "Email test completed",
      ...results,
    })
  } catch (error: any) {
    console.error("💥 Email test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Email test failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
