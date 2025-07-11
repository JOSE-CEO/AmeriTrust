import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

interface Quote {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  currentInsurer?: string
  message?: string
  createdAt: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    try {
      // Check if SMTP configuration is available
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP configuration not found. Email functionality will be disabled.")
        return
      }

      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      console.log("Email transporter initialized successfully")
    } catch (error) {
      console.error("Failed to initialize email transporter:", error)
      this.transporter = null
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log("Email transporter not available")
      return false
    }

    try {
      await this.transporter.verify()
      console.log("SMTP connection verified successfully")
      return true
    } catch (error) {
      console.error("SMTP connection failed:", error)
      return false
    }
  }

  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log("Email service not configured - skipping email send")
      return false
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "AmeriTrust Insurance Group <noreply@ameritrust.com>",
        to,
        subject,
        text,
        html: html || this.generateHTML(text, subject),
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", {
        messageId: info.messageId,
        to,
        subject,
        accepted: info.accepted,
        rejected: info.rejected,
      })

      return true
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  private generateHTML(text: string, subject: string): string {
    const formattedText = text.replace(/\n/g, "<br>")

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #16a34a, #2563eb);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .message {
              background: #f9fafb;
              padding: 20px;
              border-left: 4px solid #16a34a;
              margin: 20px 0;
            }
            .footer {
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 8px 8px;
              font-size: 14px;
              color: #6b7280;
            }
            .contact-info {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .contact-info h3 {
              color: #16a34a;
              margin-bottom: 10px;
            }
            .contact-item {
              margin: 5px 0;
            }
            .logo {
              font-size: 20px;
              font-weight: bold;
              color: #16a34a;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">AmeriTrust Insurance Group</div>
            <h1>Insurance Communication</h1>
          </div>
          
          <div class="content">
            <div class="message">
              ${formattedText}
            </div>
            
            <div class="contact-info">
              <h3>Contact Information</h3>
              <div class="contact-item"><strong>Phone:</strong> (678) 217-5044</div>
              <div class="contact-item"><strong>Email:</strong> ameritrustins@gmail.com</div>
              <div class="contact-item"><strong>Address:</strong> 2198 Austell Rd SW #104, Marietta, GA 30008</div>
              <div class="contact-item"><strong>Hours:</strong> Mon-Fri 8AM-6PM, Sat 9AM-4PM</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from AmeriTrust Insurance Group.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>&copy; 2025 AmeriTrust Insurance Group. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  }

  async sendQuoteNotification(to: string, quote: Quote): Promise<boolean> {
    const subject = `🚨 NEW QUOTE REQUEST - ${quote.serviceType} Insurance`

    const emailContent = `URGENT: New Quote Request Received

Customer Details:
First Name: ${quote.firstName}
Last Name: ${quote.lastName}
Email: ${quote.email}
Phone: ${quote.phone}
Service Type: ${quote.serviceType}
Current Insurer: ${quote.currentInsurer || "N/A"}
Message: ${quote.message || "N/A"}
Created At: ${quote.createdAt}`

    return await this.sendEmail({
      to,
      subject,
      text: emailContent,
    })
  }

  async sendQuoteConfirmation(to: string, customerName: string, serviceType: string): Promise<boolean> {
    const subject = `Quote Request Received - ${serviceType} Insurance`

    const emailContent = `Dear ${customerName},

Thank you for your interest in AmeriTrust Insurance Group!

We have successfully received your quote request for ${serviceType} insurance. Our team of experienced insurance professionals will review your information and prepare a personalized quote for you.

What happens next:
• Our team will review your request within 2 business hours
• We'll prepare a customized quote based on your specific needs
• You'll receive your quote via email or phone within 24 hours
• No loss runs needed - we make the process simple!

If you have any immediate questions or need to speak with someone right away, please don't hesitate to call us at (678) 217-5044. We're here to help!

Thank you for choosing AmeriTrust Insurance Group for your insurance needs.

Best regards,
AmeriTrust Insurance Group Team

---
AmeriTrust Insurance Group
Phone: (678) 217-5044
Email: ameritrustins@gmail.com
Address: 2198 Austell Rd SW #104, Marietta, GA 30008

Follow us on social media:
Facebook: https://www.facebook.com/profile.php?id=61576680140801
Instagram: https://www.instagram.com/ameritrust__insurance__group/`

    return await this.sendEmail({
      to,
      subject,
      text: emailContent,
    })
  }

  async sendQuoteReply(to: string, customerName: string, serviceType: string, message: string): Promise<boolean> {
    const subject = `Re: Your Insurance Quote Request - ${serviceType}`

    return await this.sendEmail({
      to,
      subject,
      text: message,
    })
  }

  async sendContactReply(to: string, customerName: string, originalSubject: string, message: string): Promise<boolean> {
    const subject = `Re: ${originalSubject}`

    return await this.sendEmail({
      to,
      subject,
      text: message,
    })
  }
}

// Create and export a singleton instance
export const emailService = new EmailService()
