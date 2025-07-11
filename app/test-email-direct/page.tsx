"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react"

export default function EmailTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-email-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "admin-notification-test",
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: "Network error",
        details: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="h-6 w-6 text-green-600" />
              Email System Test
            </CardTitle>
            <CardDescription>Test the email notification system for AmeriTrust Insurance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button onClick={testEmail} disabled={isLoading} size="lg" className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Test Email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </div>

            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      {result.success ? (
                        <div>
                          <p className="font-semibold text-green-800 mb-2">✅ Email sent successfully!</p>
                          <div className="text-sm text-green-700 space-y-1">
                            <p>
                              <strong>Message ID:</strong> {result.messageId}
                            </p>
                            <p>
                              <strong>Recipients:</strong> {result.recipients?.join(", ")}
                            </p>
                            <p>
                              <strong>Timestamp:</strong> {result.timestamp}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-red-800 mb-2">❌ Email failed to send</p>
                          <div className="text-sm text-red-700 space-y-1">
                            <p>
                              <strong>Error:</strong> {result.error}
                            </p>
                            <p>
                              <strong>Details:</strong> {result.details}
                            </p>
                            {result.troubleshooting && (
                              <div className="mt-3">
                                <p className="font-medium">Troubleshooting:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {Object.entries(result.troubleshooting).map(([key, value]) => (
                                    <li key={key}>{value as string}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📧 Test Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• This test sends an email to all admin addresses</p>
                <p>• Recipients: ameritrustins@gmail.com, josemwaura078@gmail.com, wanguhu2@hotmail.com</p>
                <p>• Uses the same email system as quote notifications</p>
                <p>• Check your inbox and spam folder for the test email</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Environment Requirements</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>• RESEND_API_KEY must be set in environment variables</p>
                <p>• Sending domain should be verified in Resend dashboard</p>
                <p>• Check Resend logs if emails are not received</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
