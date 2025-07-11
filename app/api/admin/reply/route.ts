import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, type, originalId, customerName, serviceType, originalSubject } = await request.json()

    // Validate required fields
    if (!to || !subject || !message || !type || !originalId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Processing email reply:", {
      to,
      subject,
      type,
      originalId,
      timestamp: new Date().toISOString(),
    })

    // Send the actual email
    let emailSent = false

    try {
      const { emailServiceAPI } = await import("@/lib/email-services")

      if (type === "quote") {
        emailSent = await emailServiceAPI.sendQuoteReply(
          to,
          customerName || "Valued Customer",
          serviceType || "Insurance",
          message,
        )
      } else {
        emailSent = await emailServiceAPI.sendContactReply(
          to,
          customerName || "Valued Customer",
          originalSubject || "Your Inquiry",
          message,
        )
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      emailSent = false
    }

    if (!emailSent) {
      return NextResponse.json(
        {
          error: "Failed to send email. Please check your email configuration.",
        },
        { status: 500 },
      )
    }

    // Update the status of the original item to "contacted"
    try {
      const endpoint = type === "quote" ? "/api/quote" : "/api/contact"
      const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: originalId,
          status: "contacted",
        }),
      })

      if (!updateResponse.ok) {
        console.error("Failed to update status after reply")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }

    console.log("Email sent successfully:", {
      to,
      subject,
      type,
      originalId,
      sentAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully to customer's email",
      emailSent: true,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Reply API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send reply. Please try again.",
      },
      { status: 500 },
    )
  }
}
