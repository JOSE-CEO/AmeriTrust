"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"

export default function DebugEmailPage() {
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDebugTests = async () => {
    setIsLoading(true)
    setResults(null)

    try {
      // Test 1: Check production environment
      console.log("🔍 Testing production environment...")
      const prodResponse = await fetch("/api/debug/production")
      const prodData = await prodResponse.json()

      // Test 2: Test quote submission
      console.log("🧪 Testing quote submission...")
      const quoteResponse = await fetch("/api/debug/test-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const quoteData = await quoteResponse.json()

      setResults({
        production: prodData,
        quote: quoteData,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Debug test failed:", error)
      setResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testRealQuote = async () => {
    setIsLoading(true)

    try {
      console.log("🚀 Testing real quote submission...")
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Debug",
          lastName: "Test",
          email: "ameritrustins@gmail.com", // Use owner email to avoid sandbox issues
          phone: "(555) 123-4567",
          serviceType: "auto",
          currentInsurer: "Test Insurance",
          message: "This is a debug test quote",
        }),
      })

      const data = await response.json()
      console.log("Quote response:", data)

      setResults({
        realQuote: data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Real quote test failed:", error)
      setResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Email Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={runDebugTests} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  "🧪 Run Debug Tests"
                )}
              </Button>

              <Button onClick={testRealQuote} disabled={isLoading} variant="outline" className="flex-1 bg-transparent">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "🚀 Test Real Quote"
                )}
              </Button>
            </div>

            {results && (
              <div className="space-y-4">
                {results.error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Error:</strong> {results.error}
                    </AlertDescription>
                  </Alert>
                )}

                {results.production && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🔍 Production Environment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Environment:</strong> {results.production.environment?.NODE_ENV}
                          </div>
                          <div>
                            <strong>Vercel Env:</strong> {results.production.environment?.VERCEL_ENV}
                          </div>
                          <div>
                            <strong>Email Service:</strong> {results.production.emailConfig?.EMAIL_SERVICE}
                          </div>
                          <div>
                            <strong>API Key Length:</strong> {results.production.emailConfig?.EMAIL_API_KEY_LENGTH}
                          </div>
                          <div>
                            <strong>Email From:</strong> {results.production.emailConfig?.EMAIL_FROM}
                          </div>
                          <div>
                            <strong>Owner Email:</strong> {results.production.emailConfig?.RESEND_OWNER_EMAIL}
                          </div>
                        </div>

                        {results.production.tests && (
                          <div className="mt-4 p-3 bg-gray-100 rounded">
                            <strong>Service Tests:</strong>
                            <div className="mt-2 space-y-1 text-sm">
                              <div>
                                Can Import Service:{" "}
                                {results.production.tests.canImportEmailService ? "✅ Yes" : "❌ No"}
                              </div>
                              {results.production.tests.emailServiceError && (
                                <div className="text-red-600">Error: {results.production.tests.emailServiceError}</div>
                              )}
                              {results.production.tests.sandboxInfo && (
                                <div>
                                  Sandbox Mode: {results.production.tests.sandboxInfo.sandbox ? "⚠️ Yes" : "✅ No"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {results.quote && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🧪 Quote Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Service Loaded:</strong>{" "}
                            {results.quote.results?.emailTests?.serviceLoaded ? "✅ Yes" : "❌ No"}
                          </div>
                          <div>
                            <strong>Config Valid:</strong>{" "}
                            {results.quote.results?.emailTests?.configValid ? "✅ Yes" : "❌ No"}
                          </div>
                          <div>
                            <strong>Admin Email:</strong>{" "}
                            {results.quote.results?.emailTests?.adminEmailTest ? "✅ Sent" : "❌ Failed"}
                          </div>
                          <div>
                            <strong>Customer Email:</strong>{" "}
                            {results.quote.results?.emailTests?.customerEmailTest ? "✅ Sent" : "❌ Failed"}
                          </div>
                        </div>

                        {results.quote.results?.emailTests?.errors?.length > 0 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <strong className="text-red-800">Errors:</strong>
                            <ul className="mt-1 text-sm text-red-700">
                              {results.quote.results.emailTests.errors.map((error: string, index: number) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {results.quote.results?.emailTests?.warnings?.length > 0 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <strong className="text-yellow-800">Warnings:</strong>
                            <ul className="mt-1 text-sm text-yellow-700">
                              {results.quote.results.emailTests.warnings.map((warning: string, index: number) => (
                                <li key={index}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {results.realQuote && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🚀 Real Quote Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Success:</strong> {results.realQuote.success ? "✅ Yes" : "❌ No"}
                          </div>
                          <div>
                            <strong>Quote ID:</strong> {results.realQuote.id || "N/A"}
                          </div>
                          <div>
                            <strong>Admin Emails Sent:</strong>{" "}
                            {results.realQuote.emailStatus?.adminNotificationsSent || 0}
                          </div>
                          <div>
                            <strong>Customer Email:</strong>{" "}
                            {results.realQuote.emailStatus?.customerConfirmationSent ? "✅ Sent" : "❌ Failed"}
                          </div>
                        </div>

                        {results.realQuote.emailErrors?.length > 0 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <strong className="text-red-800">Email Errors:</strong>
                            <ul className="mt-1 text-sm text-red-700">
                              {results.realQuote.emailErrors.map((error: string, index: number) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {results.realQuote.emailWarnings?.length > 0 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <strong className="text-yellow-800">Email Warnings:</strong>
                            <ul className="mt-1 text-sm text-yellow-700">
                              {results.realQuote.emailWarnings.map((warning: string, index: number) => (
                                <li key={index}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📋 Raw Debug Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
