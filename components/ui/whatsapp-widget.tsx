"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppWidget() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "16785583721" // Updated WhatsApp number
    const message = "Hello! I would like to inquire about insurance services."
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 group-hover:animate-pulse" />
      </button>
    </div>
  )
}
