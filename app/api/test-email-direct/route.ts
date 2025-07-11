import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 === EMAIL TEST API START ===")

    const body = await request.json()
    const { testType = "basic" } = body

    // Check environment variables
    const apiKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM || "AmeriTrust Insurance <noreply@resend.dev>"

    console.log("🔧 Environment Check:")
    console.log("- RESEND_API_KEY present:", Boolean(apiKey))
    console.log("- EMAIL_FROM:", emailFrom)

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY not configured",
          details: "Please set RESEND_API_KEY in your environment variables",
        },
        { status: 500 },
      )
    }

    // Test email content
    const testEmails = ["ameritrustins@gmail.com", "josemwaura078@gmail.com", "wanguhu2@hotmail.com"]
    const subject = `🧪 Email Test - ${new Date().toLocaleString()}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Test</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Test Successful</h1>
            <p>AmeriTrust Insurance Group</p>
          </div>
          <div class="content">
            <div class="success">
              <strong>🎉 Great news!</strong> Your email system is working correctly.
            </div>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Test Type: ${testType}</li>
              <li>Timestamp: ${new Date().toISOString()}</li>
              <li>API Key: ${apiKey ? "Configured ✅" : "Missing ❌"}</li>
              <li>From Address: ${emailFrom}</li>
            </ul>
            <p>If you received this email, your notification system is ready to send quote alerts to the admin team.</p>
          </div>
        </div>
      </body>
      </html>
    `

    console.log("📧 Sending test email...")
    console.log("- To:", testEmails)
    console.log("- Subject:", subject)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: testEmails,
        subject: subject,
        html: htmlContent,
      }),
    })

    console.log("📧 Resend API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Resend API Error:", errorText)

      return NextResponse.json(
        {
          success: false,
          error: `Resend API Error (${response.status})`,
          details: errorText,
          troubleshooting: {
            checkApiKey: "Verify RESEND_API_KEY is correct",
            checkDomain: "Ensure sending domain is verified in Resend",
            checkRecipients: "Verify recipient email addresses are valid",
          },
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("✅ Test email sent successfully!")
    console.log("- Message ID:", result.id)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: result.id,
      recipients: testEmails,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("💥 Email test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Email test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email Test API",
    usage: "POST to this endpoint to test email functionality",
    endpoints: {
      test: "POST /api/test-email-direct",
    },
  })
}
