"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"

interface TestResult {
  success: boolean
  timestamp: string
  testType: string
  results: any
  message?: string
  error?: string
  details?: string
}

export default function TestEmailPage() {
  const [testType, setTestType] = useState<string>("")
  const [testEmail, setTestEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TestResult | null>(null)

  const handleTest = async () => {
    if (!testType) {
      alert("Please select a test type")
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      console.log("🧪 Starting email test:", { testType, testEmail })

      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: testType,
          email: testEmail || undefined,
        }),
      })

      const data = await response.json()
      console.log("🧪 Test response:", data)

      setResults(data)
    } catch (error: any) {
      console.error("💥 Test error:", error)
      setResults({
        success: false,
        error: "Network error",
        details: error.message,
        timestamp: new Date().toISOString(),
        testType: testType,
        results: {},
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderResults = () => {
    if (!results) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {results.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            Test Results
          </CardTitle>
          <CardDescription>Test completed at {new Date(results.timestamp).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={results.success ? "default" : "destructive"}>
              {results.success ? "SUCCESS" : "FAILED"}
            </Badge>
            <span className="text-sm text-gray-600">Test Type: {results.testType}</span>
          </div>

          {results.message && (
            <Alert>
              <AlertDescription>{results.message}</AlertDescription>
            </Alert>
          )}

          {results.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results.error}</div>
                {results.details && <div className="text-sm mt-1">{results.details}</div>}
              </AlertDescription>
            </Alert>
          )}

          {/* Detailed Results */}
          {results.results && Object.keys(results.results).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Detailed Results:</h4>

              {results.results.adminNotification && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Admin Notification:</h5>
                  <div className="text-sm space-y-1">
                    <div>Success: {results.results.adminNotification.success ? "✅" : "❌"}</div>
                    <div>Notifications Sent: {results.results.adminNotification.adminNotificationsSent}</div>
                    {results.results.adminNotification.errors?.length > 0 && (
                      <div className="text-red-600">Errors: {results.results.adminNotification.errors.join(", ")}</div>
                    )}
                    {results.results.adminNotification.warnings?.length > 0 && (
                      <div className="text-yellow-600">
                        Warnings: {results.results.adminNotification.warnings.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {results.results.simpleEmail && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Simple Email:</h5>
                  <div className="text-sm space-y-1">
                    <div>Success: {results.results.simpleEmail.success ? "✅" : "❌"}</div>
                    <div>Recipient: {results.results.simpleEmail.recipient}</div>
                    <div>Subject: {results.results.simpleEmail.subject}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw JSON for debugging */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              View Raw Response (Debug)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(results, null, 2)}</pre>
          </details>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Email System Test</h1>
            <p className="text-green-600">Test the email functionality to ensure notifications are working properly</p>
          </div>

          {/* Test Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-green-600" />
                Email Test Configuration
              </CardTitle>
              <CardDescription>Select a test type and configure the test parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type *</Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin Notification Test</SelectItem>
                      <SelectItem value="simple">Simple Email Test</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    {testType === "admin" && "Tests the admin notification system with mock quote data"}
                    {testType === "simple" && "Sends a simple test email to verify basic functionality"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testEmail">Test Email (Optional)</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-600">Leave empty to use default test addresses</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleTest}
                  disabled={isLoading || !testType}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running Test...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Run Email Test
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {renderResults()}

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Notification Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  This test simulates a new quote submission and sends admin notifications to:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• ameritrustins@gmail.com</li>
                  <li>• josemwaura078@gmail.com</li>
                  <li>• wanguhu2@hotmail.com</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simple Email Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sends a basic test email to verify that the email service is working correctly. You can specify a
                  custom email address or use the default test address.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Environment Info */}
          <Card className="mt-6 border-l-4 border-green-600">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Environment Information</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Email Service: Resend API</div>
                <div>From Address: AmeriTrust Insurance {"<noreply@resend.dev>"}</div>
                <div>Test Environment: {process.env.NODE_ENV || "development"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
