import { NextResponse } from "next/server"

// Sample testimonials data - in a real app, this would come from a database
const testimonials = [
  {
    id: "1",
    name: "Jennifer Martinez",
    location: "Austin, TX",
    rating: 5,
    review:
      "AmeriTrust made switching my auto insurance so easy! I saved over $800 a year and got better coverage. Their customer service is outstanding.",
    serviceType: "Auto Insurance",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Robert Chen",
    location: "San Francisco, CA",
    rating: 5,
    review:
      "As a small business owner, finding the right commercial insurance was crucial. AmeriTrust provided exactly what I needed at a great price.",
    serviceType: "Commercial Insurance",
    date: "2024-01-10",
  },
  {
    id: "3",
    name: "Sarah Williams",
    location: "Miami, FL",
    rating: 5,
    review:
      "After my house was damaged in a storm, AmeriTrust handled everything perfectly. The claims process was smooth and stress-free.",
    serviceType: "Home Insurance",
    date: "2024-01-05",
  },
  {
    id: "4",
    name: "Michael Thompson",
    location: "Chicago, IL",
    rating: 5,
    review:
      "The team at AmeriTrust is incredibly knowledgeable and helpful. They took the time to explain all my options and found me the perfect policy.",
    serviceType: "Life Insurance",
    date: "2023-12-28",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    location: "Denver, CO",
    rating: 5,
    review:
      "I've been with AmeriTrust for 5 years now. Their rates are competitive and their service is unmatched. Highly recommend!",
    serviceType: "Auto Insurance",
    date: "2023-12-20",
  },
  {
    id: "6",
    name: "David Rodriguez",
    location: "Phoenix, AZ",
    rating: 5,
    review:
      "Getting a quote was incredibly fast - same day as promised! The whole process was transparent and professional.",
    serviceType: "Business Insurance",
    date: "2023-12-15",
  },
]

export async function GET() {
  try {
    // In a real application, you would fetch from your database
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, location, rating, review, serviceType } = body

    if (!name || !location || !rating || !review || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new testimonial
    const newTestimonial = {
      id: Date.now().toString(),
      name,
      location,
      rating: Number.parseInt(rating),
      review,
      serviceType,
      date: new Date().toISOString(),
    }

    // In a real app, save to database
    testimonials.push(newTestimonial)

    return NextResponse.json(
      { message: "Testimonial added successfully", testimonial: newTestimonial },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding testimonial:", error)
    return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 })
  }
}
