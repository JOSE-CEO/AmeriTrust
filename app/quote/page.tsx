"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Phone, Mail, Clock, CheckCircle, AlertTriangle, Truck, Car, Building, Users } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  currentInsurer: string
  message: string
  // Auto insurance specific fields
  driverName: string
  driverDateOfBirth: string
  driverLicenseNo: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  address: string
  // Commercial trucking specific fields
  companyName: string
  dotNumber: string
  mcNumber: string
  state: string
  ownerName: string
  commercialDriverName: string
  commercialDriverDateOfBirth: string
  commercialDriverLicenseNo: string
  truckYear: string
  truckMake: string
  truckModel: string
  trailerYear: string
  trailerMake: string
  trailerModel: string
}

interface FormErrors {
  [key: string]: string
}

export default function QuotePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "",
    currentInsurer: "",
    message: "",
    // Auto insurance fields
    driverName: "",
    driverDateOfBirth: "",
    driverLicenseNo: "",
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    address: "",
    // Commercial trucking fields
    companyName: "",
    dotNumber: "",
    mcNumber: "",
    state: "",
    ownerName: "",
    commercialDriverName: "",
    commercialDriverDateOfBirth: "",
    commercialDriverLicenseNo: "",
    truckYear: "",
    truckMake: "",
    truckModel: "",
    trailerYear: "",
    trailerMake: "",
    trailerModel: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [quoteId, setQuoteId] = useState("")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Basic required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.serviceType) newErrors.serviceType = "Please select an insurance type"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Auto insurance validation
    if (formData.serviceType === "auto") {
      if (!formData.driverName.trim()) newErrors.driverName = "Driver name is required"
      if (!formData.driverDateOfBirth.trim()) newErrors.driverDateOfBirth = "Date of birth is required"
      if (!formData.driverLicenseNo.trim()) newErrors.driverLicenseNo = "License number is required"
      if (!formData.vehicleYear.trim()) newErrors.vehicleYear = "Vehicle year is required"
      if (!formData.vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required"
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = "Vehicle model is required"
      if (!formData.address.trim()) newErrors.address = "Address is required"
    }

    // Commercial trucking validation
    if (formData.serviceType === "commercial") {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
      if (!formData.dotNumber.trim()) newErrors.dotNumber = "DOT number is required"
      if (!formData.state.trim()) newErrors.state = "State is required"
      if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
      if (!formData.commercialDriverName.trim()) newErrors.commercialDriverName = "Driver name is required"
      if (!formData.commercialDriverDateOfBirth.trim())
        newErrors.commercialDriverDateOfBirth = "Date of birth is required"
      if (!formData.commercialDriverLicenseNo.trim())
        newErrors.commercialDriverLicenseNo = "CDL license number is required"
      if (!formData.truckYear.trim()) newErrors.truckYear = "Truck year is required"
      if (!formData.truckMake.trim()) newErrors.truckMake = "Truck make is required"
      if (!formData.truckModel.trim()) newErrors.truckModel = "Truck model is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setQuoteId(result.id)
        setIsSubmitted(true)

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          serviceType: "",
          currentInsurer: "",
          message: "",
          driverName: "",
          driverDateOfBirth: "",
          driverLicenseNo: "",
          vehicleYear: "",
          vehicleMake: "",
          vehicleModel: "",
          address: "",
          companyName: "",
          dotNumber: "",
          mcNumber: "",
          state: "",
          ownerName: "",
          commercialDriverName: "",
          commercialDriverDateOfBirth: "",
          commercialDriverLicenseNo: "",
          truckYear: "",
          truckMake: "",
          truckModel: "",
          trailerYear: "",
          trailerMake: "",
          trailerModel: "",
        })
      } else {
        console.error("Quote submission failed:", result.error)
        alert("There was an error submitting your quote. Please try again or call us directly.")
      }
    } catch (error) {
      console.error("Error submitting quote:", error)
      alert("There was an error submitting your quote. Please try again or call us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 shadow-xl">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Submitted Successfully!</h1>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold">
                    Reference ID: <span className="font-mono">AMT-{quoteId}</span>
                  </p>
                </div>

                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Thank you for choosing AmeriTrust Insurance Group! Our expert team has received your quote request and
                  will review your information to prepare a personalized quote.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    What Happens Next:
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        1
                      </div>
                      <p className="text-gray-700">Our team will review your information within 2 business hours</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        2
                      </div>
                      <p className="text-gray-700">We'll prepare a customized quote based on your specific needs</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        3
                      </div>
                      <p className="text-gray-700">You'll receive your quote via email or phone within 24 hours</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        4
                      </div>
                      <p className="text-gray-700">No loss runs needed - we make the process simple!</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    Submit Another Quote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/")}
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
                  >
                    Return to Home
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href="tel:(678) 217-5044"
                      className="flex items-center text-green-600 hover:text-green-700 font-semibold"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      (678) 217-5044
                    </a>
                    <a
                      href="mailto:ameritrustins@gmail.com"
                      className="flex items-center text-green-600 hover:text-green-700 font-semibold"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      ameritrustins@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Your Free Insurance Quote</h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Protect what matters most with competitive rates and personalized coverage from Georgia's trusted
              insurance experts.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No Loss Runs Required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>24-Hour Response</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Competitive Rates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us Now</h3>
                    <p className="text-sm text-gray-600">Speak with an expert</p>
                  </div>
                </div>
                <a
                  href="tel:(678) 217-5044"
                  className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  (678) 217-5044
                </a>
                <p className="text-sm text-gray-600 mt-2">Mon-Fri 8AM-6PM, Sat 9AM-4PM</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-sm text-gray-600">Get a written response</p>
                  </div>
                </div>
                <a
                  href="mailto:ameritrustins@gmail.com"
                  className="text-lg font-semibold text-green-600 hover:text-green-700 transition-colors break-all"
                >
                  ameritrustins@gmail.com
                </a>
                <p className="text-sm text-gray-600 mt-2">We respond within 2 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Quote Form */}
          <Card className="border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-3" />
                Request Your Free Quote
              </CardTitle>
              <CardDescription className="text-green-100">
                Fill out the form below and we'll prepare a personalized quote for you within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`mt-1 h-12 ${errors.firstName ? "border-red-500" : "border-gray-300"} focus:border-green-500 focus:ring-green-500`}
                        required
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`mt-1 h-12 ${errors.lastName ? "border-red-500" : "border-gray-300"} focus:border-green-500 focus:ring-green-500`}
                        required
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`mt-1 h-12 ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-green-500 focus:ring-green-500`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`mt-1 h-12 ${errors.phone ? "border-red-500" : "border-gray-300"} focus:border-green-500 focus:ring-green-500`}
                        required
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Insurance Type Selection */}
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Insurance Type</h3>
                  </div>

                  <div>
                    <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700">
                      What type of insurance do you need? *
                    </Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => handleInputChange("serviceType", value)}
                    >
                      <SelectTrigger
                        className={`mt-1 h-12 ${errors.serviceType ? "border-red-500" : "border-gray-300"} focus:border-green-500 focus:ring-green-500`}
                      >
                        <SelectValue placeholder="Select insurance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🚗 Auto Insurance</SelectItem>
                        <SelectItem value="home">🏠 Home Insurance</SelectItem>
                        <SelectItem value="business">🏢 Business Insurance</SelectItem>
                        <SelectItem value="commercial">🚛 Commercial Trucking</SelectItem>
                        <SelectItem value="health">🏥 Health Insurance</SelectItem>
                        <SelectItem value="life">❤️ Life Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.serviceType}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="currentInsurer" className="text-sm font-medium text-gray-700">
                      Current Insurance Company (Optional)
                    </Label>
                    <Input
                      id="currentInsurer"
                      type="text"
                      value={formData.currentInsurer}
                      onChange={(e) => handleInputChange("currentInsurer", e.target.value)}
                      className="mt-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Auto Insurance Details */}
                {formData.serviceType === "auto" && (
                  <>
                    <Separator />
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center mb-6">
                        <Car className="w-6 h-6 text-green-600 mr-3" />
                        <h3 className="text-lg font-semibold text-green-800">Auto Insurance Details</h3>
                        <Badge variant="secondary" className="ml-3 bg-green-200 text-green-800">
                          Required
                        </Badge>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="driverName" className="text-sm font-medium text-green-700">
                              Driver Name *
                            </Label>
                            <Input
                              id="driverName"
                              type="text"
                              value={formData.driverName}
                              onChange={(e) => handleInputChange("driverName", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.driverName ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.driverName && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.driverName}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="driverDateOfBirth" className="text-sm font-medium text-green-700">
                              Date of Birth *
                            </Label>
                            <Input
                              id="driverDateOfBirth"
                              type="date"
                              value={formData.driverDateOfBirth}
                              onChange={(e) => handleInputChange("driverDateOfBirth", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.driverDateOfBirth ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.driverDateOfBirth && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.driverDateOfBirth}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="driverLicenseNo" className="text-sm font-medium text-green-700">
                            Driver's License Number *
                          </Label>
                          <Input
                            id="driverLicenseNo"
                            type="text"
                            value={formData.driverLicenseNo}
                            onChange={(e) => handleInputChange("driverLicenseNo", e.target.value)}
                            className={`mt-1 h-12 bg-white ${errors.driverLicenseNo ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                            required
                          />
                          {errors.driverLicenseNo && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              {errors.driverLicenseNo}
                            </p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="vehicleYear" className="text-sm font-medium text-green-700">
                              Vehicle Year *
                            </Label>
                            <Input
                              id="vehicleYear"
                              type="text"
                              value={formData.vehicleYear}
                              onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.vehicleYear ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.vehicleYear && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.vehicleYear}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="vehicleMake" className="text-sm font-medium text-green-700">
                              Vehicle Make *
                            </Label>
                            <Input
                              id="vehicleMake"
                              type="text"
                              value={formData.vehicleMake}
                              onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.vehicleMake ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.vehicleMake && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.vehicleMake}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="vehicleModel" className="text-sm font-medium text-green-700">
                              Vehicle Model *
                            </Label>
                            <Input
                              id="vehicleModel"
                              type="text"
                              value={formData.vehicleModel}
                              onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.vehicleModel ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.vehicleModel && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.vehicleModel}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-sm font-medium text-green-700">
                            Address *
                          </Label>
                          <Input
                            id="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className={`mt-1 h-12 bg-white ${errors.address ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                            required
                          />
                          {errors.address && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              {errors.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Commercial Trucking Details */}
                {formData.serviceType === "commercial" && (
                  <>
                    <Separator />
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center mb-6">
                        <Truck className="w-6 h-6 text-green-600 mr-3" />
                        <h3 className="text-lg font-semibold text-green-800">Commercial Trucking Details</h3>
                        <Badge variant="secondary" className="ml-3 bg-green-200 text-green-800">
                          Required
                        </Badge>
                      </div>

                      <div className="space-y-8">
                        {/* Company Information */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-4 flex items-center">
                            <Building className="w-5 h-5 mr-2" />
                            Company Information
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="companyName" className="text-sm font-medium text-green-700">
                                Company Name *
                              </Label>
                              <Input
                                id="companyName"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange("companyName", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.companyName ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.companyName}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="dotNumber" className="text-sm font-medium text-green-700">
                                DOT Number *
                              </Label>
                              <Input
                                id="dotNumber"
                                type="text"
                                value={formData.dotNumber}
                                onChange={(e) => handleInputChange("dotNumber", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.dotNumber ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.dotNumber && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.dotNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6 mt-6">
                            <div>
                              <Label htmlFor="mcNumber" className="text-sm font-medium text-green-700">
                                MC Number
                              </Label>
                              <Input
                                id="mcNumber"
                                type="text"
                                value={formData.mcNumber}
                                onChange={(e) => handleInputChange("mcNumber", e.target.value)}
                                className="mt-1 h-12 bg-white border-green-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>

                            <div>
                              <Label htmlFor="state" className="text-sm font-medium text-green-700">
                                State *
                              </Label>
                              <Input
                                id="state"
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.state ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.state && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.state}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="ownerName" className="text-sm font-medium text-green-700">
                                Owner Name *
                              </Label>
                              <Input
                                id="ownerName"
                                type="text"
                                value={formData.ownerName}
                                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.ownerName ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.ownerName && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.ownerName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Driver Information */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Driver Information
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="commercialDriverName" className="text-sm font-medium text-green-700">
                                Driver Name *
                              </Label>
                              <Input
                                id="commercialDriverName"
                                type="text"
                                value={formData.commercialDriverName}
                                onChange={(e) => handleInputChange("commercialDriverName", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.commercialDriverName ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.commercialDriverName && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.commercialDriverName}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label
                                htmlFor="commercialDriverDateOfBirth"
                                className="text-sm font-medium text-green-700"
                              >
                                Date of Birth *
                              </Label>
                              <Input
                                id="commercialDriverDateOfBirth"
                                type="date"
                                value={formData.commercialDriverDateOfBirth}
                                onChange={(e) => handleInputChange("commercialDriverDateOfBirth", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.commercialDriverDateOfBirth ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.commercialDriverDateOfBirth && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.commercialDriverDateOfBirth}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-6">
                            <Label htmlFor="commercialDriverLicenseNo" className="text-sm font-medium text-green-700">
                              CDL License Number *
                            </Label>
                            <Input
                              id="commercialDriverLicenseNo"
                              type="text"
                              value={formData.commercialDriverLicenseNo}
                              onChange={(e) => handleInputChange("commercialDriverLicenseNo", e.target.value)}
                              className={`mt-1 h-12 bg-white ${errors.commercialDriverLicenseNo ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                              required
                            />
                            {errors.commercialDriverLicenseNo && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {errors.commercialDriverLicenseNo}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Truck Information */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-4 flex items-center">
                            <Truck className="w-5 h-5 mr-2" />
                            Truck Information
                          </h4>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <Label htmlFor="truckYear" className="text-sm font-medium text-green-700">
                                Year *
                              </Label>
                              <Input
                                id="truckYear"
                                type="text"
                                value={formData.truckYear}
                                onChange={(e) => handleInputChange("truckYear", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.truckYear ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.truckYear && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.truckYear}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="truckMake" className="text-sm font-medium text-green-700">
                                Make *
                              </Label>
                              <Input
                                id="truckMake"
                                type="text"
                                value={formData.truckMake}
                                onChange={(e) => handleInputChange("truckMake", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.truckMake ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.truckMake && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.truckMake}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="truckModel" className="text-sm font-medium text-green-700">
                                Model *
                              </Label>
                              <Input
                                id="truckModel"
                                type="text"
                                value={formData.truckModel}
                                onChange={(e) => handleInputChange("truckModel", e.target.value)}
                                className={`mt-1 h-12 bg-white ${errors.truckModel ? "border-red-500" : "border-green-300"} focus:border-green-500 focus:ring-green-500`}
                                required
                              />
                              {errors.truckModel && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  {errors.truckModel}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Trailer Information */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-4">Trailer Information (Optional)</h4>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <Label htmlFor="trailerYear" className="text-sm font-medium text-green-700">
                                Year
                              </Label>
                              <Input
                                id="trailerYear"
                                type="text"
                                value={formData.trailerYear}
                                onChange={(e) => handleInputChange("trailerYear", e.target.value)}
                                className="mt-1 h-12 bg-white border-green-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>

                            <div>
                              <Label htmlFor="trailerMake" className="text-sm font-medium text-green-700">
                                Make
                              </Label>
                              <Input
                                id="trailerMake"
                                type="text"
                                value={formData.trailerMake}
                                onChange={(e) => handleInputChange("trailerMake", e.target.value)}
                                className="mt-1 h-12 bg-white border-green-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>

                            <div>
                              <Label htmlFor="trailerModel" className="text-sm font-medium text-green-700">
                                Model
                              </Label>
                              <Input
                                id="trailerModel"
                                type="text"
                                value={formData.trailerModel}
                                onChange={(e) => handleInputChange("trailerModel", e.target.value)}
                                className="mt-1 h-12 bg-white border-green-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Tell us more about your insurance needs (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Your Quote...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Get My Free Quote
                      </div>
                    )}
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      🔒 Your information is secure and will only be used to prepare your quote.
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      We'll contact you within 24 hours with your personalized quote.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
