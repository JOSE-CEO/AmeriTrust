// Fallback email service that logs to console/file when no service is configured

type Quote = Record<string, unknown>

interface EmailLog {
  timestamp: string
  to: string | string[]
  subject: string
  text: string
  type: "quote" | "contact" | "reply"
}

function log(label: string, payload: unknown) {
  console.log(`📝 [fallback] ${label}:`, payload)
}

class EmailFallbackService {
  private logs: EmailLog[] = []

  async sendEmail({ to, subject, text }: { to: string | string[]; subject: string; text: string }): Promise<boolean> {
    const log: EmailLog = {
      timestamp: new Date().toISOString(),
      to,
      subject,
      text,
      type: "general",
    }

    this.logs.push(log)
    this.logToConsole(log)

    // In development, you could also save to a file
    if (process.env.NODE_ENV === "development") {
      this.saveToFile(log)
    }

    return true // Always return true since we're just logging
  }

  private logToConsole(log: EmailLog) {
    console.log("\n📧 EMAIL NOTIFICATION (No Email Service Configured)")
    console.log("=".repeat(60))
    console.log(`Time: ${log.timestamp}`)
    console.log(`To: ${Array.isArray(log.to) ? log.to.join(", ") : log.to}`)
    console.log(`Subject: ${log.subject}`)
    console.log("Message:")
    console.log(log.text)
    console.log("=".repeat(60))
  }

  private async saveToFile(log: EmailLog) {
    try {
      const fs = await import("fs/promises")
      const path = await import("path")

      const logDir = path.join(process.cwd(), "logs")
      const logFile = path.join(logDir, "emails.log")

      // Create logs directory if it doesn't exist
      try {
        await fs.mkdir(logDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      const logEntry = `${log.timestamp} | TO: ${Array.isArray(log.to) ? log.to.join(", ") : log.to} | SUBJECT: ${log.subject}\n${log.text}\n${"=".repeat(80)}\n\n`

      await fs.appendFile(logFile, logEntry)
    } catch (error) {
      console.error("Failed to save email log to file:", error)
    }
  }

  async sendQuoteNotification(to: string | string[], quote: Quote): Promise<boolean> {
    const recipients = Array.isArray(to) ? to : [to]
    const subject = `🚨 NEW QUOTE REQUEST - ${quote.serviceType} Insurance`
    const text = `URGENT: New Quote Request Received

Customer Details:
Name: ${quote.firstName} ${quote.lastName}
Email: ${quote.email}
Phone: ${quote.phone}
Service: ${quote.serviceType}
Current Insurer: ${quote.currentInsurer || "N/A"}
Message: ${quote.message || "N/A"}
Submitted: ${new Date(quote.createdAt).toLocaleString()}

ACTION REQUIRED: Please contact the customer within 24 hours.`

    log("Admin notification → " + recipients.join(", "), quote)
    return true
  }

  async sendQuoteConfirmation(to: string, customerName: string, serviceType: string): Promise<boolean> {
    const subject = `Quote Request Received - ${serviceType} Insurance`
    const text = `Dear ${customerName},

Thank you for your interest in AmeriTrust Insurance Group!

We have successfully received your quote request for ${serviceType} insurance. Our team will review your information and prepare a personalized quote for you.

What happens next:
• Our team will review your request within 2 business hours
• We'll prepare a customized quote based on your specific needs
• You'll receive your quote via email or phone within 24 hours

If you have any questions, please call us at (678) 217-5044.

Best regards,
AmeriTrust Insurance Group Team`

    log("Customer confirmation → " + to, {
      customerName,
      serviceType,
    })
    return true
  }

  getLogs(): EmailLog[] {
    return this.logs
  }

  clearLogs(): void {
    this.logs = []
  }
}

export const emailFallbackService = new EmailFallbackService()
