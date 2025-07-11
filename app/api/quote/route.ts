import { type NextRequest, NextResponse } from "next/server"

interface QuoteData {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  currentInsurer: string
  message: string
  // Auto insurance specific fields
  driverName?: string
  driverDateOfBirth?: string
  driverLicenseNo?: string
  vehicleYear?: string
  vehicleMake?: string
  vehicleModel?: string
  address?: string
  // Commercial trucking specific fields
  companyName?: string
  dotNumber?: string
  mcNumber?: string
  state?: string
  ownerName?: string
  commercialDriverName?: string
  commercialDriverDateOfBirth?: string
  commercialDriverLicenseNo?: string
  truckYear?: string
  truckMake?: string
  truckModel?: string
  trailerYear?: string
  trailerMake?: string
  trailerModel?: string
}

interface EmailStatus {
  adminNotificationsSent: number
  emailServiceAvailable: boolean
  totalErrors: number
  totalWarnings: number
}

// In-memory storage for quotes (replace with database in production)
const quotes: Array<QuoteData & { id: string; timestamp: string; status: string }> = [
  // Sample data for testing
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    serviceType: "auto",
    currentInsurer: "State Farm",
    message: "Looking for better rates on my auto insurance",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 987-6543",
    serviceType: "home",
    currentInsurer: "",
    message: "Need home insurance for new property",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "new",
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// RESEND HELPER – handles sandbox/dev, validates key pattern, surfaces errors
// ──────────────────────────────────────────────────────────────────────────────
async function sendAdminNotificationEmail(
  to: string[],
  subject: string,
  htmlContent: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  /* --------------------------------------------------------------------- */
  /* 0. Config                                                             */
  /* --------------------------------------------------------------------- */
  const apiKey = process.env.RESEND_API_KEY?.trim() || ""
  const from = process.env.EMAIL_FROM || "AmeriTrust Insurance <notifications@mail.ameritrust-ins.com>" // <- a domain you’ve verified in Resend

  /* --------------------------------------------------------------------- */
  /* 1.  Fast sanity-check before we instantiate the SDK                    */
  /* --------------------------------------------------------------------- */
  const keyLooksValid = /^re_[a-zA-Z0-9_-]{32,}/.test(apiKey)
  if (!keyLooksValid) {
    return {
      success: false,
      error: "Invalid or missing RESEND_API_KEY.  " + "Set a **Live** key (starts with `re_`) in your Vercel env vars.",
    }
  }

  /* --------------------------------------------------------------------- */
  /* 2.  Allow developers to skip real email while previewing               */
  /* --------------------------------------------------------------------- */
  if (process.env.NEXT_PUBLIC_RESEND_SANDBOX === "true") {
    console.info("📨  Sandbox mode – skipping real email send.")
    console.info("ℹ️  Would send:", { to, subject })
    return { success: true, messageId: "sandbox-message-id" }
  }

  /* --------------------------------------------------------------------- */
  /* 3.  Send via official SDK                                             */
  /* --------------------------------------------------------------------- */
  try {
    const { Resend } = await import("resend") // ← lazy import keeps function tree-shakable
    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html: htmlContent,
    })

    if (error) {
      return { success: false, error: `${error.name}: ${error.message}` }
    }

    return { success: true, messageId: data?.id }
  } catch (e: any) {
    return { success: false, error: `Unexpected error: ${e.message}` }
  }
}

// Create comprehensive admin email template
function createAdminEmailHTML(quote: QuoteData & { id: string; timestamp: string }): string {
  const autoSection =
    quote.serviceType === "auto"
      ? `
    <div style="background: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
      <h3 style="color: #059669; margin-top: 0; display: flex; align-items: center;">
        🚗 Auto Insurance Details
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <p style="margin: 5px 0;"><strong>Driver Name:</strong> ${quote.driverName || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Date of Birth:</strong> ${quote.driverDateOfBirth || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>License Number:</strong> ${quote.driverLicenseNo || "N/A"}</p>
        </div>
        <div>
          <p style="margin: 5px 0;"><strong>Vehicle Year:</strong> ${quote.vehicleYear || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Vehicle Make:</strong> ${quote.vehicleMake || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Vehicle Model:</strong> ${quote.vehicleModel || "N/A"}</p>
        </div>
      </div>
      <p style="margin: 5px 0;"><strong>Address:</strong> ${quote.address || "N/A"}</p>
    </div>
  `
      : ""

  const commercialSection =
    quote.serviceType === "commercial"
      ? `
    <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1d4ed8; margin-top: 0;">🚛 Commercial Trucking Details</h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: #1e40af; margin-bottom: 10px; font-size: 16px;">Company Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <p style="margin: 5px 0;"><strong>Company Name:</strong> ${quote.companyName || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>DOT Number:</strong> ${quote.dotNumber || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>MC Number:</strong> ${quote.mcNumber || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>State:</strong> ${quote.state || "N/A"}</p>
        </div>
        <p style="margin: 5px 0;"><strong>Owner Name:</strong> ${quote.ownerName || "N/A"}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: #1e40af; margin-bottom: 10px; font-size: 16px;">Driver Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <p style="margin: 5px 0;"><strong>Driver Name:</strong> ${quote.commercialDriverName || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Date of Birth:</strong> ${quote.commercialDriverDateOfBirth || "N/A"}</p>
        </div>
        <p style="margin: 5px 0;"><strong>License Number:</strong> ${quote.commercialDriverLicenseNo || "N/A"}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: #1e40af; margin-bottom: 10px; font-size: 16px;">Truck Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <p style="margin: 5px 0;"><strong>Year:</strong> ${quote.truckYear || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Make:</strong> ${quote.truckMake || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Model:</strong> ${quote.truckModel || "N/A"}</p>
        </div>
      </div>
      
      <div>
        <h4 style="color: #1e40af; margin-bottom: 10px; font-size: 16px;">Trailer Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <p style="margin: 5px 0;"><strong>Year:</strong> ${quote.trailerYear || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Make:</strong> ${quote.trailerMake || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Model:</strong> ${quote.trailerModel || "N/A"}</p>
        </div>
      </div>
    </div>
  `
      : ""

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote Request - AMT-${quote.id}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        h1 { margin: 0; font-size: 24px; }
        h3 { color: #16a34a; margin-top: 0; }
        p { margin: 8px 0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .contact-link { color: #16a34a; text-decoration: none; font-weight: bold; }
        .contact-link:hover { text-decoration: underline; }
        @media (max-width: 600px) { 
          .grid { grid-template-columns: 1fr; } 
          .container { margin: 0; box-shadow: none; }
          .content { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ NEW QUOTE REQUEST</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">AmeriTrust Insurance Group</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>⚡ URGENT ACTION REQUIRED:</strong> New ${quote.serviceType.charAt(0).toUpperCase() + quote.serviceType.slice(1)} insurance quote request submitted and requires immediate attention.
          </div>
          
          <div class="card">
            <h3>📋 Quote Summary</h3>
            <div class="grid">
              <p><strong>Reference ID:</strong> <span style="color: #dc2626; font-weight: bold;">AMT-${quote.id}</span></p>
              <p><strong>Submitted:</strong> ${new Date(quote.timestamp).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}</p>
              <p><strong>Insurance Type:</strong> ${quote.serviceType.charAt(0).toUpperCase() + quote.serviceType.slice(1)} Insurance</p>
              <p><strong>Priority Level:</strong> <span style="color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 8px; border-radius: 4px;">HIGH</span></p>
            </div>
          </div>

          <div class="card">
            <h3>👤 Customer Contact Information</h3>
            <div class="grid">
              <p><strong>Full Name:</strong> ${quote.firstName} ${quote.lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${quote.email}" class="contact-link">${quote.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${quote.phone}" class="contact-link">${quote.phone}</a></p>
              ${quote.currentInsurer ? `<p><strong>Current Insurer:</strong> ${quote.currentInsurer}</p>` : "<p><strong>Current Insurer:</strong> <em>Not specified</em></p>"}
            </div>
          </div>

          ${autoSection}
          ${commercialSection}

          ${
            quote.message
              ? `
          <div class="card">
            <h3>💬 Customer Message</h3>
            <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #16a34a; font-style: italic;">
              "${quote.message}"
            </div>
          </div>
          `
              : ""
          }

          <div class="card" style="background: linear-gradient(135deg, #fef7ff, #f3e8ff); border-left: 4px solid #a855f7;">
            <h3 style="color: #7c3aed;">📞 IMMEDIATE ACTION PLAN</h3>
            <ol style="margin: 15px 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Contact customer within 2 hours</strong> (target response time for new quotes)</li>
              <li><strong>Review all provided information</strong> thoroughly before calling</li>
              <li><strong>Prepare personalized quote</strong> based on their specific needs and coverage requirements</li>
              <li><strong>Schedule follow-up call</strong> within 24 hours to present options</li>
              <li><strong>Send written quote</strong> via email within 48 hours</li>
            </ol>
            <div style="background: #ffffff; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0;"><strong>Customer Expectations:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Professional and knowledgeable service</li>
                <li>Competitive rates and comprehensive coverage options</li>
                <li>Quick response and efficient processing</li>
                <li>Clear explanation of policy benefits</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div style="border-top: 2px solid #16a34a; padding-top: 20px; margin-bottom: 15px;">
            <p style="font-size: 16px; font-weight: bold; color: #16a34a; margin: 0;">AmeriTrust Insurance Group</p>
          </div>
          <p style="margin: 5px 0;">📞 <strong>(678) 217-5044</strong> | 📧 <strong>ameritrustins@gmail.com</strong></p>
          <p style="margin: 5px 0;">📍 2198 Austell Rd SW #104, Marietta, GA 30008</p>
          <p style="margin: 15px 0 5px 0; font-size: 12px; opacity: 0.8; font-style: italic;">
            This is an automated notification from your quote management system. Please respond to the customer directly using their contact information above.
          </p>
          <p style="margin: 5px 0; font-size: 12px; opacity: 0.6;">
            Quote ID: AMT-${quote.id} | Generated: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== QUOTE API START ===")
    console.log("Timestamp:", new Date().toISOString())

    // Parse request body with error handling
    let quoteData: QuoteData
    try {
      const body = await request.text()
      console.log("✅ Request body received, length:", body.length)

      if (!body || body.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            error: "Empty request body",
            details: "No data was sent in the request",
          },
          { status: 400 },
        )
      }

      quoteData = JSON.parse(body)
      console.log("✅ Successfully parsed JSON request body")
      console.log("📋 Quote data preview:", {
        name: `${quoteData.firstName} ${quoteData.lastName}`,
        email: quoteData.email,
        serviceType: quoteData.serviceType,
        hasAutoFields: Boolean(quoteData.driverName),
        hasCommercialFields: Boolean(quoteData.companyName),
      })
    } catch (parseError: any) {
      console.error("❌ Failed to parse request body:", parseError.message)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          details: `JSON parse error: ${parseError.message}`,
        },
        { status: 400 },
      )
    }

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "serviceType"]
    const missingFields = requiredFields.filter((field) => {
      const value = quoteData[field as keyof QuoteData]
      return !value || (typeof value === "string" && value.trim() === "")
    })

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: `Required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(quoteData.email)) {
      console.error("❌ Invalid email format:", quoteData.email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          details: "Please enter a valid email address",
        },
        { status: 400 },
      )
    }

    // Generate unique ID and save quote
    const quoteId = Date.now().toString()
    const timestamp = new Date().toISOString()

    const savedQuote = {
      ...quoteData,
      id: quoteId,
      timestamp,
      status: "new",
    }

    quotes.push(savedQuote)
    console.log("✅ Quote saved with ID:", quoteId)

    // CRITICAL: Send admin notification emails
    console.log("📧 === EMAIL NOTIFICATION PROCESS START ===")

    const emailStatus: EmailStatus = {
      adminNotificationsSent: 0,
      emailServiceAvailable: true,
      totalErrors: 0,
      totalWarnings: 0,
    }

    try {
      const adminEmails = ["ameritrustins@gmail.com", "josemwaura078@gmail.com", "wanguhu2@hotmail.com"]
      const adminSubject = `🚨 URGENT: New ${quoteData.serviceType.toUpperCase()} Insurance Quote - AMT-${quoteId} - ${quoteData.firstName} ${quoteData.lastName}`
      const adminHTML = createAdminEmailHTML(savedQuote)

      console.log("📧 Preparing to send admin notification:")
      console.log("- Recipients:", adminEmails.join(", "))
      console.log("- Subject:", adminSubject)
      console.log("- HTML length:", adminHTML.length)

      const emailSend = await sendAdminNotificationEmail(adminEmails, adminSubject, adminHTML)

      if (emailSend.success) {
        emailStatus.adminNotificationsSent = adminEmails.length
        console.log(`✅ SUCCESS: Admin notifications sent to ${adminEmails.length} recipients`)
        console.log(`✅ Message ID: ${emailSend.messageId}`)
      } else {
        emailStatus.totalWarnings++ // was totalErrors++
        emailStatus.emailServiceAvailable = false
        console.warn(`⚠️  EMAIL WARNING – ${emailSend.error}`) // log as warning

        // Keep processing; don’t fail the whole request
      }
    } catch (emailError: any) {
      console.error("💥 CRITICAL EMAIL ERROR:", emailError)
      emailStatus.totalErrors++
      emailStatus.emailServiceAvailable = false
    }

    console.log("📧 === EMAIL NOTIFICATION PROCESS END ===")
    console.log("📊 Final Email Status:", emailStatus)

    // Prepare success response
    const response = {
      success: true,
      message:
        "Your quote request has been submitted successfully. Our team will review your information and contact you within 24 hours with a personalized quote.",
      id: quoteId,
      emailStatus: {
        adminNotificationsSent: emailStatus.adminNotificationsSent,
        emailServiceWorking: emailStatus.emailServiceAvailable,
      },
      nextSteps: [
        "Our expert team will review your information",
        "We'll prepare a customized quote based on your needs",
        "You'll receive a call within 24 hours to discuss your options",
        "We'll provide you with competitive rates and coverage details",
      ],
    }

    console.log("✅ Quote processed successfully")
    console.log("=== QUOTE API END ===")

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error("💥 CRITICAL ERROR in quote API:", error)
    console.error("Error details:", {
      type: typeof error,
      name: error?.name,
      message: error?.message,
      stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
    })

    const safeErrorResponse = {
      success: false,
      error: "Internal server error",
      details: "An unexpected error occurred while processing your quote request. Please try again or contact support.",
      timestamp: new Date().toISOString(),
    }

    console.log("❌ Returning safe error response")
    console.log("=== QUOTE API CRITICAL ERROR END ===")

    return new NextResponse(JSON.stringify(safeErrorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// GET endpoint to retrieve quotes (for admin dashboard)
export async function GET() {
  try {
    console.log("📊 Fetching all quotes...")

    const sortedQuotes = quotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`✅ Returning ${sortedQuotes.length} quotes`)

    return NextResponse.json(sortedQuotes)
  } catch (error: any) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch quotes",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// PATCH endpoint to update quote status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "Both 'id' and 'status' are required",
        },
        { status: 400 },
      )
    }

    // Find and update the quote
    const quoteIndex = quotes.findIndex((quote) => quote.id === id)

    if (quoteIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Quote not found",
          details: `No quote found with ID: ${id}`,
        },
        { status: 404 },
      )
    }

    quotes[quoteIndex] = {
      ...quotes[quoteIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    console.log("Quote status updated:", id, "->", status)

    return NextResponse.json({
      success: true,
      message: "Quote status updated successfully",
      quote: quotes[quoteIndex],
    })
  } catch (error: any) {
    console.error("Error updating quote:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
