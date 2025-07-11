"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Quote, PenTool, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  review: string
  serviceType: string
  date: string
}

interface ReviewForm {
  name: string
  location: string
  rating: number
  review: string
  serviceType: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    name: "",
    location: "",
    rating: 5,
    review: "",
    serviceType: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
        setErrorMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      const data = await response.json()
      setTestimonials(data)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setReviewForm({
      ...reviewForm,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("Thank you for your review! It has been added to our testimonials.")
        setReviewDialogOpen(false)
        setReviewForm({
          name: "",
          location: "",
          rating: 5,
          review: "",
          serviceType: "",
        })
        // Refresh testimonials to show the new review
        fetchTestimonials()
      } else {
        setErrorMessage(data.error || "Failed to submit review. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setErrorMessage("Error submitting review. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`h-5 w-5 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const renderRatingSelector = (currentRating: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setReviewForm({ ...reviewForm, rating: index + 1 })}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                index < currentRating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/services.jpg"
            alt="Professional consultation between AmeriTrust advisor and satisfied customer"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Don't just take our word for it - hear from the thousands of satisfied customers who trust AmeriTrust
          </p>
          <Button
            onClick={() => setReviewDialogOpen(true)}
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
          >
            <PenTool className="h-5 w-5 mr-2" />
            Write a Review
          </Button>
        </div>
      </section>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No testimonials available at the moment.</p>
              <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src={`/placeholder.svg?height=60&width=60&text=${testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                        <Quote className="h-6 w-6 text-green-600 mt-2" />
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      <p className="text-sm text-green-600 font-medium">{testimonial.serviceType}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(testimonial.date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Happy Customers?</h2>
          <p className="text-xl mb-8 text-green-100">Experience the AmeriTrust difference for yourself</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition-colors duration-200"
            >
              Get Your Free Quote
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-md font-semibold transition-colors duration-200"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>

      {/* Write Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PenTool className="h-5 w-5 mr-2 text-green-600" />
              Write a Review for AmeriTrust Insurance Group
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={reviewForm.location}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="City, State (e.g., Atlanta, GA)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select onValueChange={(value) => handleSelectChange("serviceType", value)} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select the service you used" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto Insurance">Auto Insurance</SelectItem>
                  <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                  <SelectItem value="Commercial Insurance">Commercial Insurance</SelectItem>
                  <SelectItem value="Business Insurance">Business Insurance</SelectItem>
                  <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                  <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                  <SelectItem value="Multiple Services">Multiple Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rating *</Label>
              <div className="mt-2">
                {renderRatingSelector(reviewForm.rating)}
                <p className="text-sm text-gray-600 mt-1">Click the stars to rate your experience</p>
              </div>
            </div>

            <div>
              <Label htmlFor="review">Your Review *</Label>
              <Textarea
                id="review"
                name="review"
                value={reviewForm.review}
                onChange={handleInputChange}
                required
                rows={5}
                className="mt-1"
                placeholder="Share your experience with AmeriTrust Insurance Group. What did you like about our service?"
              />
              <p className="text-sm text-gray-500 mt-1">{reviewForm.review.length}/500 characters</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || reviewForm.review.length < 10}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
