"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function AdminDebugPage() {
  const [apiStatus, setApiStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const testAdminAPI = async () => {
    setIsLoading(true)
    setApiStatus("")
    setTestResult(null)

    try {
      console.log("Testing admin API...")

      // Test GET request first
      const getResponse = await fetch("/api/admin/login", {
        method: "GET",
      })

      console.log("GET Response status:", getResponse.status)

      if (getResponse.ok) {
        const getData = await getResponse.json()
        console.log("GET Response data:", getData)
        setApiStatus("✅ Admin API is responding")
      } else {
        setApiStatus("❌ Admin API GET failed")
      }

      // Test POST request with test credentials
      const postResponse = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "AmeriTrust2025!",
        }),
      })

      console.log("POST Response status:", postResponse.status)

      const postData = await postResponse.json()
      console.log("POST Response data:", postData)

      setTestResult({
        status: postResponse.status,
        data: postData,
        success: postResponse.ok && postData.success,
      })
    } catch (error) {
      console.error("API test failed:", error)
      setApiStatus("❌ API test failed: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin API Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testAdminAPI} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing API...
                </>
              ) : (
                "Test Admin API"
              )}
            </Button>

            {apiStatus && (
              <Alert className={apiStatus.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {apiStatus.includes("✅") ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={apiStatus.includes("✅") ? "text-green-800" : "text-red-800"}>
                  {apiStatus}
                </AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="space-y-2">
                <h3 className="font-semibold">Test Results:</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p>
                    <strong>Status Code:</strong> {testResult.status}
                  </p>
                  <p>
                    <strong>Success:</strong> {testResult.success ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <strong>Response:</strong>
                  </p>
                  <pre className="text-sm mt-2 overflow-auto">{JSON.stringify(testResult.data, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <h4 className="font-semibold mb-2">Default Credentials:</h4>
              <p>Username: admin</p>
              <p>Password: AmeriTrust2025!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
