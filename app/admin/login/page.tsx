"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("=== CLIENT LOGIN START ===")
    console.log("Form data:", {
      username: formData.username,
      passwordLength: formData.password.length,
    })

    try {
      console.log("🚀 Sending login request...")

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Handle response safely
      let data: any = {}
      const contentType = response.headers.get("content-type") ?? ""

      if (contentType.includes("application/json")) {
        try {
          data = await response.json()
          console.log("Response data:", data)
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError)
          setError("Invalid response from server")
          return
        }
      } else {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        setError("Server returned an invalid response")
        return
      }

      if (response.ok && data.success) {
        console.log("✅ Login successful")

        // Store authentication token/session
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminUser", JSON.stringify(data.user))

        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        console.log("❌ Login failed:", data.error)
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error("💥 Login request failed:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
      console.log("=== CLIENT LOGIN END ===")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/placeholder.svg?height=1080&width=1920&text=Admin+Security+Background"
          alt="Admin background"
          fill
          className="object-cover"
        />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-gray-700 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <p className="text-gray-600 mt-2">Access AmeriTrust Admin Dashboard</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Authorized personnel only</p>
            <p className="text-xs text-gray-400 mt-1">Contact IT support if you need access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
