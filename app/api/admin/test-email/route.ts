import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json({ error: "Test email address is required" }, { status: 400 })
    }

    console.log("Testing email configuration with:", testEmail)

    // Import the email service
    const { emailServiceAPI } = await import("@/lib/email-services")

    // Send test email
    const testEmailSent = await emailServiceAPI.sendEmail({
      to: testEmail,
      subject: "AmeriTrust Admin - Email Configuration Test ✅",
      text: `This is a test email from AmeriTrust Insurance Group admin system.

If you received this email, your Resend email configuration is working correctly!

Test Details:
- Sent at: ${new Date().toISOString()}
- Email Service: Resend
- From: ${process.env.EMAIL_FROM || "Not configured"}

✅ Email notifications are now working
✅ Quote confirmations will be sent
✅ Admin replies will be delivered

Best regards,
AmeriTrust Admin System`,
    })

    if (testEmailSent) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully via Resend! Check your inbox.",
      })
    } else {
      return NextResponse.json(
        {
          error: "Failed to send test email. Please check your Resend API key.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json(
      {
        error: "Email test failed. Please check your Resend configuration.",
      },
      { status: 500 },
    )
  }
}
