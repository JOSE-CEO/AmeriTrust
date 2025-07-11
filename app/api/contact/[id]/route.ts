import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would connect to your database here
// For this example, we'll simulate database operations
const contacts: any[] = []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    // Find the contact index
    const contactIndex = contacts.findIndex((contact) => contact.id === id)

    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    // Remove the contact
    const deletedContact = contacts.splice(contactIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
      deletedContact,
    })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const contact = contacts.find((contact) => contact.id === id)

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
