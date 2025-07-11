// Test script to verify email configuration
import { emailService } from "../lib/email.js"

async function testEmailConfiguration() {
  console.log("🧪 Testing Email Configuration...")
  console.log("================================")

  // Test 1: Check if environment variables are set
  console.log("\n1. Checking Environment Variables:")
  console.log("SMTP_HOST:", process.env.SMTP_HOST ? "✅ Set" : "❌ Missing")
  console.log("SMTP_PORT:", process.env.SMTP_PORT ? "✅ Set" : "❌ Missing")
  console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Missing")
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ Missing")
  console.log("SMTP_FROM:", process.env.SMTP_FROM ? "✅ Set" : "❌ Missing")

  // Test 2: Test SMTP connection
  console.log("\n2. Testing SMTP Connection:")
  const connectionTest = await emailService.testConnection()
  console.log("Connection:", connectionTest ? "✅ Success" : "❌ Failed")

  if (!connectionTest) {
    console.log("\n❌ Email configuration failed!")
    console.log("Please check your SMTP settings and try again.")
    return
  }

  // Test 3: Send test email
  console.log("\n3. Sending Test Email:")
  const testEmail = process.env.SMTP_USER // Send to yourself

  if (!testEmail) {
    console.log("❌ No test email address available")
    return
  }

  const emailSent = await emailService.sendEmail({
    to: testEmail,
    subject: "AmeriTrust Email Test - Configuration Successful!",
    text: `Congratulations! Your email configuration is working correctly.

Test Details:
- Sent at: ${new Date().toISOString()}
- SMTP Host: ${process.env.SMTP_HOST}
- From: ${process.env.SMTP_FROM}

Your AmeriTrust Insurance website is now ready to send:
✅ Quote request notifications
✅ Customer confirmations
✅ Admin replies

Best regards,
AmeriTrust Admin System`,
  })

  console.log("Test Email:", emailSent ? "✅ Sent Successfully" : "❌ Failed")

  if (emailSent) {
    console.log("\n🎉 Email Configuration Complete!")
    console.log("Check your inbox for the test email.")
  } else {
    console.log("\n❌ Email sending failed. Please check your configuration.")
  }
}

// Run the test
testEmailConfiguration().catch(console.error)
