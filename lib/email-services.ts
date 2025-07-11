import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface QuoteData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  currentInsurer?: string
  message?: string
  // Auto insurance specific fields
  driverName?: string
  driverDateOfBirth?: string
  driverLicenseNo?: string
  vehicleYear?: string
  vehicleMake?: string
  vehicleModel?: string
  address?: string
  submittedAt: string
}

interface EmailResult {
  success: boolean
  adminNotificationsSent: number
  errors: string[]
  warnings: string[]
}

export async function sendAdminNotification(quoteData: QuoteData): Promise<EmailResult> {
  const result: EmailResult = {
    success: false,
    adminNotificationsSent: 0,
    errors: [],
    warnings: [],
  }

  try {
    console.log("📧 Preparing admin notification email...")

    const adminEmails = ["ameritrustins@gmail.com", "josemwaura078@gmail.com", "wanguhu2@hotmail.com"]

    const subject = `🚨 New ${quoteData.serviceType.charAt(0).toUpperCase() + quoteData.serviceType.slice(1)} Insurance Quote - AMT-${quoteData.id}`

    // Create auto insurance section if applicable
    const autoSection =
      quoteData.serviceType === "auto"
        ? `
      <div style="background: #f0f9ff; padding: 15px; margin: 15px 0; border-radius: 8px;">
        <h3>🚗 Auto Insurance Details</h3>
        <p><strong>Driver:</strong> ${quoteData.driverName || "N/A"}</p>
        <p><strong>Date of Birth:</strong> ${quoteData.driverDateOfBirth || "N/A"}</p>
        <p><strong>License:</strong> ${quoteData.driverLicenseNo || "N/A"}</p>
        <p><strong>Vehicle:</strong> ${quoteData.vehicleYear || ""} ${quoteData.vehicleMake || ""} ${quoteData.vehicleModel || ""}</p>
        <p><strong>Address:</strong> ${quoteData.address || "N/A"}</p>
      </div>
    `
        : ""

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>🛡️ New Quote Request</h1>
          <p>AmeriTrust Insurance</p>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <strong>⚡ Action Required:</strong> New ${quoteData.serviceType} insurance quote request
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>📋 Quote Details</h3>
            <p><strong>Reference ID:</strong> AMT-${quoteData.id}</p>
            <p><strong>Submitted:</strong> ${new Date(quoteData.submittedAt).toLocaleString()}</p>
            <p><strong>Insurance Type:</strong> ${quoteData.serviceType.charAt(0).toUpperCase() + quoteData.serviceType.slice(1)} Insurance</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>👤 Customer Information</h3>
            <p><strong>Name:</strong> ${quoteData.firstName} ${quoteData.lastName}</p>
            <p><strong>Email:</strong> ${quoteData.email}</p>
            <p><strong>Phone:</strong> ${quoteData.phone}</p>
            ${quoteData.currentInsurer ? `<p><strong>Current Insurer:</strong> ${quoteData.currentInsurer}</p>` : ""}
          </div>

          ${autoSection}

          ${
            quoteData.message
              ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
              <h3>💬 Additional Information</h3>
              <p>${quoteData.message}</p>
            </div>
          `
              : ""
          }

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
            <p><strong>Next Steps:</strong></p>
            <p>1. Review the quote details above</p>
            <p>2. Contact the customer within 24 hours</p>
            <p>3. Prepare a personalized quote</p>
            <br>
            <p>AmeriTrust Insurance | (678) 217-5044 | ameritrustins@gmail.com</p>
          </div>
        </div>
      </div>
    `

    // Send email to all admin addresses
    console.log(`📧 Sending admin notification to: ${adminEmails.join(", ")}`)

    const emailResponse = await resend.emails.send({
      from: "AmeriTrust Insurance <noreply@resend.dev>",
      to: adminEmails,
      subject: subject,
      html: htmlContent,
    })

    if (emailResponse.error) {
      console.error("❌ Resend API error:", emailResponse.error)
      result.errors.push(`Admin notification failed: ${emailResponse.error.message}`)
    } else {
      console.log("✅ Admin notification sent successfully:", emailResponse.data?.id)
      result.adminNotificationsSent = adminEmails.length
      result.success = true
    }
  } catch (error: any) {
    console.error("💥 Error sending admin notification:", error)
    result.errors.push(`Email service error: ${error.message}`)
  }

  return result
}

export async function sendTestEmail(to: string, subject: string, content: string): Promise<boolean> {
  try {
    console.log(`📧 Sending test email to: ${to}`)

    const response = await resend.emails.send({
      from: "AmeriTrust Insurance <noreply@resend.dev>",
      to: [to],
      subject: subject,
      html: content,
    })

    if (response.error) {
      console.error("❌ Test email failed:", response.error)
      return false
    }

    console.log("✅ Test email sent successfully:", response.data?.id)
    return true
  } catch (error: any) {
    console.error("💥 Test email error:", error)
    return false
  }
}
