import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("=== TEST QUOTE DEBUG START ===")

    const testQuote = {
      id: "test-" + Date.now(),
      firstName: "Test",
      lastName: "Customer",
      email: "test@example.com",
      phone: "(555) 123-4567",
      serviceType: "auto",
      currentInsurer: "Test Insurance",
      message: "This is a test quote",
      createdAt: new Date().toISOString(),
      status: "new",
    }

    const results = {
      quoteCreated: true,
      emailTests: {
        serviceLoaded: false,
        configValid: false,
        adminEmailTest: false,
        customerEmailTest: false,
        errors: [] as string[],
        warnings: [] as string[],
      },
    }

    // Test email service
    try {
      console.log("🧪 Testing email service...")

      if (!process.env.EMAIL_API_KEY) {
        results.emailTests.errors.push("EMAIL_API_KEY missing")
        throw new Error("EMAIL_API_KEY not found")
      }

      if (!process.env.EMAIL_SERVICE) {
        results.emailTests.errors.push("EMAIL_SERVICE missing")
        throw new Error("EMAIL_SERVICE not found")
      }

      const { emailServiceAPI } = await import("@/lib/email-services")
      results.emailTests.serviceLoaded = true
      results.emailTests.configValid = true

      console.log("✅ Email service loaded")

      // Test admin notification
      try {
        console.log("🧪 Testing admin notification...")
        const adminSuccess = await emailServiceAPI.sendQuoteNotification(["ameritrustins@gmail.com"], testQuote)
        results.emailTests.adminEmailTest = adminSuccess

        if (adminSuccess) {
          console.log("✅ Admin email test passed")
        } else {
          console.log("❌ Admin email test failed")
          results.emailTests.errors.push("Admin email failed to send")
        }
      } catch (adminError) {
        console.error("❌ Admin email error:", adminError)
        results.emailTests.errors.push(`Admin email error: ${adminError.message}`)
      }

      // Test customer confirmation (to owner email to avoid sandbox issues)
      try {
        console.log("🧪 Testing customer confirmation...")
        const customerSuccess = await emailServiceAPI.sendQuoteConfirmation(
          "ameritrustins@gmail.com", // Send to owner email to avoid sandbox restrictions
          "Test Customer",
          "auto",
        )
        results.emailTests.customerEmailTest = customerSuccess

        if (customerSuccess) {
          console.log("✅ Customer email test passed")
        } else {
          console.log("❌ Customer email test failed")
          results.emailTests.errors.push("Customer email failed to send")
        }
      } catch (customerError) {
        console.error("❌ Customer email error:", customerError)
        results.emailTests.errors.push(`Customer email error: ${customerError.message}`)
      }
    } catch (emailError) {
      console.error("💥 Email service error:", emailError)
      results.emailTests.errors.push(`Email service error: ${emailError.message}`)
    }

    console.log("🏁 Test results:", results)

    return NextResponse.json({
      message: "Test quote processed",
      testQuote,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Test quote error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
