"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Reply,
  LogOut,
  Loader2,
  Trash2,
  Filter,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  TestTube,
  Car,
  Truck,
  Building,
} from "lucide-react"

interface Quote {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  currentInsurer: string
  message: string
  createdAt: string
  timestamp?: string
  status: string
  // Auto insurance specific fields
  driverName?: string
  driverDateOfBirth?: string
  driverLicenseNo?: string
  vehicleYear?: string
  vehicleMake?: string
  vehicleModel?: string
  address?: string
  // Commercial trucking specific fields
  companyName?: string
  dotNumber?: string
  mcNumber?: string
  state?: string
  ownerName?: string
  commercialDriverName?: string
  commercialDriverDateOfBirth?: string
  commercialDriverLicenseNo?: string
  truckYear?: string
  truckMake?: string
  truckModel?: string
  trailerYear?: string
  trailerMake?: string
  trailerModel?: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
  status: string
}

interface ReplyForm {
  to: string
  subject: string
  message: string
  type: "quote" | "contact"
  originalId: string
  customerName?: string
  serviceType?: string
  originalSubject?: string
}

interface Filters {
  search: string
  status: string
  serviceType: string
  dateRange: string
}

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [replyForm, setReplyForm] = useState<ReplyForm>({
    to: "",
    subject: "",
    message: "",
    type: "quote",
    originalId: "",
  })
  const [isReplying, setIsReplying] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "quote" | "contact"; name: string } | null>(null)
  const [itemToUpdate, setItemToUpdate] = useState<{
    id: string
    type: "quote" | "contact"
    name: string
    currentStatus: string
  } | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    serviceType: "all",
    dateRange: "all",
  })
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const [emailTestDialogOpen, setEmailTestDialogOpen] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [isTestingEmail, setIsTestingEmail] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [quotes, contacts, filters])

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
        setErrorMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  const checkAuthentication = () => {
    const token = localStorage.getItem("adminToken")
    const user = localStorage.getItem("adminUser")

    if (token && user) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      router.push("/admin/login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const fetchData = async () => {
    try {
      console.log("📊 Fetching admin data...")

      const [quotesResponse, contactsResponse] = await Promise.all([
        fetch("/api/quote").catch((err) => {
          console.error("Quote API error:", err)
          return { ok: false, json: () => Promise.resolve([]) }
        }),
        fetch("/api/contact").catch((err) => {
          console.error("Contact API error:", err)
          return { ok: false, json: () => Promise.resolve([]) }
        }),
      ])

      console.log("📊 API Responses:", {
        quotesOk: quotesResponse.ok,
        contactsOk: contactsResponse.ok,
      })

      // Handle quotes response with robust error handling
      let quotesData: Quote[] = []
      if (quotesResponse.ok) {
        try {
          const rawQuotes = await quotesResponse.json()
          console.log("📊 Raw quotes response:", typeof rawQuotes, rawQuotes)

          // Handle different response formats
          if (Array.isArray(rawQuotes)) {
            quotesData = rawQuotes
          } else if (rawQuotes && Array.isArray(rawQuotes.data)) {
            quotesData = rawQuotes.data
          } else if (rawQuotes && rawQuotes.success && Array.isArray(rawQuotes.quotes)) {
            quotesData = rawQuotes.quotes
          } else {
            console.warn("⚠️ Unexpected quotes response format:", rawQuotes)
            quotesData = []
          }
        } catch (parseError) {
          console.error("❌ Error parsing quotes response:", parseError)
          quotesData = []
        }
      } else {
        console.warn("⚠️ Quotes API request failed")
        quotesData = []
      }

      // Handle contacts response with robust error handling
      let contactsData: Contact[] = []
      if (contactsResponse.ok) {
        try {
          const rawContacts = await contactsResponse.json()
          console.log("📊 Raw contacts response:", typeof rawContacts, rawContacts)

          // Handle different response formats
          if (Array.isArray(rawContacts)) {
            contactsData = rawContacts
          } else if (rawContacts && Array.isArray(rawContacts.data)) {
            contactsData = rawContacts.data
          } else if (rawContacts && rawContacts.success && Array.isArray(rawContacts.contacts)) {
            contactsData = rawContacts.contacts
          } else {
            console.warn("⚠️ Unexpected contacts response format:", rawContacts)
            contactsData = []
          }
        } catch (parseError) {
          console.error("❌ Error parsing contacts response:", parseError)
          contactsData = []
        }
      } else {
        console.warn("⚠️ Contacts API request failed")
        contactsData = []
      }

      // Normalize quotes data
      const normalizedQuotes = quotesData.map((q: any) => ({
        ...q,
        createdAt: q.createdAt || q.timestamp || new Date().toISOString(),
        status: q.status || "new",
      }))

      // Normalize contacts data
      const normalizedContacts = contactsData.map((c: any) => ({
        ...c,
        createdAt: c.createdAt || c.timestamp || new Date().toISOString(),
        status: c.status || "new",
      }))

      console.log("✅ Normalized data:", {
        quotes: normalizedQuotes.length,
        contacts: normalizedContacts.length,
      })

      setQuotes(normalizedQuotes)
      setContacts(normalizedContacts)
    } catch (error) {
      console.error("💥 Critical error fetching data:", error)
      setErrorMessage("Failed to load admin data. Please refresh the page.")
      // Set empty arrays as fallback
      setQuotes([])
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    // Ensure quotes is always an array before filtering
    const quotesToFilter = Array.isArray(quotes) ? quotes : []
    const contactsToFilter = Array.isArray(contacts) ? contacts : []

    // Filter quotes
    const filteredQuotesList = quotesToFilter.filter((quote) => {
      const matchesSearch =
        !filters.search ||
        `${quote.firstName} ${quote.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.serviceType.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === "all" || quote.status === filters.status
      const matchesServiceType = filters.serviceType === "all" || quote.serviceType === filters.serviceType
      const matchesDate = filters.dateRange === "all" || checkDateRange(quote.createdAt, filters.dateRange)

      return matchesSearch && matchesStatus && matchesServiceType && matchesDate
    })
    setFilteredQuotes(filteredQuotesList)

    // Filter contacts
    const filteredContactsList = contactsToFilter.filter((contact) => {
      const matchesSearch =
        !filters.search ||
        contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.subject.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === "all" || contact.status === filters.status
      const matchesDate = filters.dateRange === "all" || checkDateRange(contact.createdAt, filters.dateRange)

      return matchesSearch && matchesStatus && matchesDate
    })
    setFilteredContacts(filteredContactsList)
  }

  const checkDateRange = (dateString: string, range: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    switch (range) {
      case "today":
        return daysDiff === 0
      case "week":
        return daysDiff <= 7
      case "month":
        return daysDiff <= 30
      case "3months":
        return daysDiff <= 90
      default:
        return true
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      serviceType: "all",
      dateRange: "all",
    })
  }

  const openReplyDialog = (item: Quote | Contact, type: "quote" | "contact") => {
    const isQuote = type === "quote"
    const quote = item as Quote
    const contact = item as Contact

    setReplyForm({
      to: item.email,
      subject: isQuote ? `Re: Your Insurance Quote Request - ${quote.serviceType}` : `Re: ${contact.subject}`,
      message: isQuote
        ? `Dear ${quote.firstName} ${quote.lastName},

Thank you for your interest in our ${quote.serviceType.toLowerCase()} coverage. We have reviewed your request and would like to provide you with a personalized quote.

Based on your requirements, we can offer you competitive rates and comprehensive coverage options. I would be happy to discuss the details with you over the phone or via email.

Please let me know your preferred time for a consultation, and I'll be glad to assist you further.

Best regards,
AmeriTrust Insurance Group
(678) 217-5044`
        : `Dear ${contact.name},

Thank you for contacting AmeriTrust Insurance Group. We have received your message regarding "${contact.subject}" and appreciate you reaching out to us.

Our team will review your inquiry and provide you with a detailed response shortly. If you have any urgent questions, please don't hesitate to call us at (678) 217-5044.

We look forward to assisting you with your insurance needs.

Best regards,
AmeriTrust Insurance Group`,
      type,
      originalId: item.id,
      customerName: isQuote ? `${quote.firstName} ${quote.lastName}` : contact.name,
      serviceType: isQuote ? quote.serviceType : undefined,
      originalSubject: !isQuote ? contact.subject : undefined,
    })
    setReplyDialogOpen(true)
  }

  const openDeleteDialog = (item: Quote | Contact, type: "quote" | "contact") => {
    const name = type === "quote" ? `${(item as Quote).firstName} ${(item as Quote).lastName}` : (item as Contact).name
    setItemToDelete({ id: item.id, type, name })
    setDeleteDialogOpen(true)
  }

  const openStatusDialog = (item: Quote | Contact, type: "quote" | "contact") => {
    const name = type === "quote" ? `${(item as Quote).firstName} ${(item as Quote).lastName}` : (item as Contact).name
    setItemToUpdate({ id: item.id, type, name, currentStatus: item.status })
    setNewStatus(item.status)
    setStatusDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const endpoint =
        itemToDelete.type === "quote" ? `/api/quote/${itemToDelete.id}` : `/api/contact/${itemToDelete.id}`
      const response = await fetch(endpoint, {
        method: "DELETE",
      })

      if (response.ok) {
        // Remove from local state
        if (itemToDelete.type === "quote") {
          setQuotes(quotes.filter((q) => q.id !== itemToDelete.id))
        } else {
          setContacts(contacts.filter((c) => c.id !== itemToDelete.id))
        }
        setSuccessMessage(`${itemToDelete.type === "quote" ? "Quote" : "Contact"} deleted successfully`)
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      } else {
        setErrorMessage("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      setErrorMessage("Error deleting item")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!itemToUpdate || !newStatus) return

    setIsUpdatingStatus(true)
    try {
      const endpoint = itemToUpdate.type === "quote" ? "/api/quote" : "/api/contact"
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemToUpdate.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        // Update local state
        if (itemToUpdate.type === "quote") {
          setQuotes(quotes.map((q) => (q.id === itemToUpdate.id ? { ...q, status: newStatus } : q)))
        } else {
          setContacts(contacts.map((c) => (c.id === itemToUpdate.id ? { ...c, status: newStatus } : c)))
        }
        setSuccessMessage(`Status updated to "${newStatus}" successfully`)
        setStatusDialogOpen(false)
        setItemToUpdate(null)
      } else {
        setErrorMessage("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setErrorMessage("Error updating status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsReplying(true)

    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...replyForm,
          customerName: replyForm.customerName,
          serviceType: replyForm.serviceType,
          originalSubject: replyForm.originalSubject,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the status to "contacted" in local state
        if (replyForm.type === "quote") {
          setQuotes(quotes.map((q) => (q.id === replyForm.originalId ? { ...q, status: "contacted" } : q)))
        } else {
          setContacts(contacts.map((c) => (c.id === replyForm.originalId ? { ...c, status: "contacted" } : c)))
        }

        setSuccessMessage("Email sent successfully to customer and status updated to 'contacted'")
        setReplyDialogOpen(false)
        setReplyForm({
          to: "",
          subject: "",
          message: "",
          type: "quote",
          originalId: "",
        })
      } else {
        setErrorMessage(data.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      setErrorMessage("Error sending email. Please check your email configuration.")
    } finally {
      setIsReplying(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "new":
        return <AlertTriangle className="h-4 w-4" />
      case "contacted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case "auto":
        return <Car className="h-4 w-4" />
      case "commercial":
        return <Truck className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const handleEmailTest = async () => {
    if (!testEmail) return

    setIsTestingEmail(true)
    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(data.message)
      } else {
        setErrorMessage(data.error)
      }

      setEmailTestDialogOpen(false)
      setTestEmail("")
    } catch (error) {
      console.error("Email test error:", error)
      setErrorMessage("Failed to test email configuration")
    } finally {
      setIsTestingEmail(false)
    }
  }

  const renderQuoteDetails = (quote: Quote) => {
    if (quote.serviceType === "auto") {
      return (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <Car className="h-4 w-4 text-green-600 mr-2" />
            <span className="font-semibold text-green-800">Auto Insurance Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-700">
            <div>
              <strong>Driver:</strong> {quote.driverName || "N/A"}
            </div>
            <div>
              <strong>DOB:</strong> {quote.driverDateOfBirth || "N/A"}
            </div>
            <div>
              <strong>License:</strong> {quote.driverLicenseNo || "N/A"}
            </div>
            <div>
              <strong>Vehicle:</strong> {quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}
            </div>
            <div className="sm:col-span-2">
              <strong>Address:</strong> {quote.address || "N/A"}
            </div>
          </div>
        </div>
      )
    }

    if (quote.serviceType === "commercial") {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Truck className="h-4 w-4 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800">Commercial Trucking Details</span>
          </div>
          <div className="space-y-3 text-sm text-blue-700">
            <div>
              <div className="font-semibold mb-1">Company Information:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div>
                  <strong>Company:</strong> {quote.companyName || "N/A"}
                </div>
                <div>
                  <strong>DOT:</strong> {quote.dotNumber || "N/A"}
                </div>
                <div>
                  <strong>MC:</strong> {quote.mcNumber || "N/A"}
                </div>
                <div>
                  <strong>State:</strong> {quote.state || "N/A"}
                </div>
                <div className="sm:col-span-2">
                  <strong>Owner:</strong> {quote.ownerName || "N/A"}
                </div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Driver Information:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div>
                  <strong>Driver:</strong> {quote.commercialDriverName || "N/A"}
                </div>
                <div>
                  <strong>DOB:</strong> {quote.commercialDriverDateOfBirth || "N/A"}
                </div>
                <div className="sm:col-span-2">
                  <strong>License:</strong> {quote.commercialDriverLicenseNo || "N/A"}
                </div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Vehicle Information:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div>
                  <strong>Truck:</strong> {quote.truckYear} {quote.truckMake} {quote.truckModel}
                </div>
                <div>
                  <strong>Trailer:</strong> {quote.trailerYear} {quote.trailerMake} {quote.trailerModel}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage quote requests and contact messages</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button
              onClick={() => setEmailTestDialogOpen(true)}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Email
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Mobile Filter Toggle */}
        <div className="mb-4 sm:hidden">
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className={`mb-6 ${!showFilters ? "hidden sm:block" : ""}`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm">
                  Status
                </Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="serviceType" className="text-sm">
                  Service Type
                </Label>
                <Select
                  value={filters.serviceType}
                  onValueChange={(value) => setFilters({ ...filters, serviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All services</SelectItem>
                    <SelectItem value="auto">Auto Insurance</SelectItem>
                    <SelectItem value="home">Home Insurance</SelectItem>
                    <SelectItem value="commercial">Commercial Trucking</SelectItem>
                    <SelectItem value="business">Business Insurance</SelectItem>
                    <SelectItem value="life">Life Insurance</SelectItem>
                    <SelectItem value="health">Health Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateRange" className="text-sm">
                  Date Range
                </Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quotes" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Quote Requests</span>
              <span className="sm:hidden">Quotes</span>
              <span className="ml-1">
                ({filteredQuotes.length}/{quotes.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Contact Messages</span>
              <span className="sm:hidden">Contacts</span>
              <span className="ml-1">
                ({filteredContacts.length}/{contacts.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-6">
            {filteredQuotes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">
                    {quotes.length === 0 ? "No quote requests yet." : "No quotes match your filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredQuotes.map((quote) => (
                  <Card key={quote.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                        <CardTitle className="text-lg flex items-center">
                          {getServiceTypeIcon(quote.serviceType)}
                          <span className="ml-2">
                            {quote.firstName} {quote.lastName}
                          </span>
                        </CardTitle>
                        <Badge
                          className={`${getStatusColor(quote.status)} cursor-pointer`}
                          onClick={() => openStatusDialog(quote, "quote")}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(quote.status)}
                            <span className="ml-1">{quote.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{quote.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{quote.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{quote.serviceType}</span>
                        </div>
                        {quote.currentInsurer && (
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Current: {quote.currentInsurer}</span>
                          </div>
                        )}
                      </div>

                      {/* Render specific quote details */}
                      {renderQuoteDetails(quote)}

                      {quote.message && (
                        <div className="text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4 inline mr-2" />
                          <span className="break-words">
                            {quote.message.substring(0, 100)}
                            {quote.message.length > 100 && "..."}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t space-y-3 sm:space-y-0">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(quote.createdAt)}
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                            onClick={() => openReplyDialog(quote, "quote")}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => openDeleteDialog(quote, "quote")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            {filteredContacts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">
                    {contacts.length === 0 ? "No contact messages yet." : "No contacts match your filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <p className="text-sm font-medium text-gray-700 mt-1 break-words">{contact.subject}</p>
                        </div>
                        <Badge
                          className={`${getStatusColor(contact.status)} cursor-pointer flex-shrink-0`}
                          onClick={() => openStatusDialog(contact, "contact")}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(contact.status)}
                            <span className="ml-1">{contact.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4 inline mr-2" />
                        <span className="break-words">
                          {contact.message.substring(0, 150)}
                          {contact.message.length > 150 && "..."}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t space-y-3 sm:space-y-0">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(contact.createdAt)}
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                            onClick={() => openReplyDialog(contact, "contact")}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => openDeleteDialog(contact, "contact")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Reply</DialogTitle>
          </DialogHeader>
          <Alert className="border-green-200 bg-green-50">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              This email will be delivered to <strong>{replyForm.to}</strong> and the status will be updated to
              "contacted"
            </AlertDescription>
          </Alert>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={replyForm.to}
                onChange={(e) => setReplyForm({ ...replyForm, to: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={replyForm.subject}
                onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={replyForm.message}
                onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                required
                rows={10}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReplyDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isReplying} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                {isReplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reply & Update Status"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Update the status for <span className="font-semibold">{itemToUpdate?.name}</span>
            </p>
            <div>
              <Label htmlFor="newStatus">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus || newStatus === itemToUpdate?.currentStatus}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                This action cannot be undone. The {itemToDelete?.type} will be permanently deleted.
              </AlertDescription>
            </Alert>
            <p className="text-gray-600">
              Are you sure you want to delete the {itemToDelete?.type} from{" "}
              <span className="font-semibold">{itemToDelete?.name}</span>?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Test Dialog */}
      <Dialog open={emailTestDialogOpen} onOpenChange={setEmailTestDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle>Test Email Configuration</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert className="border-blue-200 bg-blue-50 mb-4">
              <Settings className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This will send a test email to verify your SMTP configuration is working correctly.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email to test with"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailTestDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmailTest}
              disabled={isTestingEmail || !testEmail}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              {isTestingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
