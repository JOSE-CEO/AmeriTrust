import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-300 mb-4 max-w-md">
              Protecting what matters most to you. With over 12 years of experience, AmeriTrust Insurance Group provides
              comprehensive coverage solutions for individuals and businesses.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61576680140801"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6 text-green-400 hover:text-green-300 hover:scale-110 cursor-pointer transition-all duration-200 group-hover:drop-shadow-lg" />
              </a>
              <a
                href="https://www.instagram.com/ameritrust__insurance__group/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6 text-green-400 hover:text-green-300 hover:scale-110 cursor-pointer transition-all duration-200 group-hover:drop-shadow-lg" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-3">Follow us for insurance tips and updates!</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Get Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-green-400" />
                <span className="text-gray-300">(678) 217-5044</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-green-400" />
                <span className="text-gray-300">ameritrustins@gmail.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-green-400 mt-1" />
                <span className="text-gray-300">
                  2198 Austell Rd SW #104
                  <br />
                  Marietta, GA 30008
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">© 2025 AmeriTrust Insurance Group. All rights reserved.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              {/* Developer Credit */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  Developed by{" "}
                  <a
                    href="https://infinititechsolutions.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
                  >
                    Infinititech Solutions
                  </a>
                </p>
                <p className="text-gray-500 text-xs italic">Building The Future, One line of code at a Time</p>
              </div>

              {/* Admin Login Button */}
              <Link href="/admin/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-green-400 hover:bg-green-400/10 transition-all duration-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
