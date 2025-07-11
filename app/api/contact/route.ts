import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would connect to your database here
const contacts: any[] = [
  // Sample data for testing
  {
    id: "1",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "(555) 456-7890",
    subject: "Question about commercial insurance",
    message:
      "I need information about commercial insurance for my trucking business. Can you provide details about coverage options and pricing?",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: "new",
  },
  {
    id: "2",
    name: "Lisa Davis",
    email: "lisa.davis@email.com",
    phone: "(555) 321-0987",
    subject: "Claim assistance needed",
    message: "I need help with filing a claim for my recent auto accident. What documents do I need to provide?",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: "pending",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create contact record
    const contact = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: "new",
    }

    // Save to our simulated database
    contacts.push(contact)

    console.log("New contact created:", contact.id)

    return NextResponse.json({ message: "Message sent successfully", id: contact.id }, { status: 201 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return all contacts sorted by creation date (newest first)
    const sortedContacts = contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json(sortedContacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find and update the contact
    const contactIndex = contacts.findIndex((contact) => contact.id === id)

    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    contacts[contactIndex] = {
      ...contacts[contactIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    console.log("Contact status updated:", id, "->", status)

    return NextResponse.json({
      success: true,
      message: "Contact status updated successfully",
      contact: contacts[contactIndex],
    })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
