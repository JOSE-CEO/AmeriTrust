import { type NextRequest, NextResponse } from "next/server"

// Import the quotes array from the main route (in a real app, this would be a database)
// For simulation, we'll access the same data structure
const quotes: any[] = []

// Function to get quotes from the main API (simulating database access)
async function getQuotesFromDB() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/quote`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching quotes:", error)
  }
  return []
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Quote ID is required" }, { status: 400 })
    }

    // In a real application, you would delete from the database
    // For now, we'll simulate the deletion
    console.log("Deleting quote with ID:", id)

    // Simulate successful deletion
    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
      deletedId: id,
    })
  } catch (error) {
    console.error("Error deleting quote:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const quotes = await getQuotesFromDB()

    const quote = quotes.find((quote: any) => quote.id === id)

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Error fetching quote:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
