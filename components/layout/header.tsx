"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrentPath } from "@/hooks/use-pathname"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentPath = useCurrentPath()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Get Quote", href: "/quote" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(href)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white py-2 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <a
                href="tel:6782175044"
                className="flex items-center hover:text-green-300 transition-colors duration-200 cursor-pointer mobile-contact-item"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>(678) 217-5044</span>
              </a>
              <a
                href="mailto:ameritrustins@gmail.com"
                className="flex items-center hover:text-green-300 transition-colors duration-200 cursor-pointer mobile-contact-item"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">ameritrustins@gmail.com</span>
                <span className="sm:hidden">Email Us</span>
              </a>
            </div>

            {/* Support Text */}
            <div className="text-green-400 text-center mobile-support-text mt-1 sm:mt-0">
              <span className="hidden sm:inline">24/7 Support Available</span>
              <span className="sm:hidden">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/ameritrust-logo.png"
                alt="AmeriTrust Insurance Group - Professional Insurance Solutions"
                width={250}
                height={80}
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative font-medium transition-all duration-300 group px-3 py-2 ${
                  isActive(item.href) ? "text-green-600 bg-green-50 rounded-md" : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-green-600 transition-all duration-300 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
            <Link href="/quote">
              <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Get Free Quote
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium px-4 py-3 rounded-md transition-all duration-300 block ${
                    isActive(item.href)
                      ? "text-green-600 bg-green-50 border-l-4 border-green-600"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/quote" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full mt-2">Get Free Quote</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
