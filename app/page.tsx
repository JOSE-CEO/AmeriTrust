import { Shield, Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Carousel from "@/components/ui/carousel"
import Image from "next/image"

export default function HomePage() {
  const heroSlides = [
    {
      id: "1",
      image: "/images/hero-family.jpeg",
      title: "Protect What Matters Most",
      subtitle: "with AmeriTrust Insurance",
      description: "Comprehensive coverage for your family, home, and future with same-day quotes and 24/7 support",
      cta: {
        text: "Get Free Quote Now",
        href: "/quote",
      },
    },
    {
      id: "2",
      image: "/images/hero-office.jpeg",
      title: "Business Insurance",
      subtitle: "Tailored for Your Success",
      description: "Protect your business with comprehensive commercial insurance solutions from industry experts",
      cta: {
        text: "Protect My Business",
        href: "/quote",
      },
    },
    {
      id: "3",
      image: "/images/hero-truck.jpeg",
      title: "Commercial Auto & Trucking",
      subtitle: "Drive with Confidence",
      description:
        "Complete commercial vehicle coverage with no loss runs needed and competitive rates for all drivers",
      cta: {
        text: "Get Commercial Quote",
        href: "/quote",
      },
    },
  ]

  const features = [
    {
      icon: Shield,
      title: " Reliable Protection",
      description: "Backed by strong financial stability and a reputation for consistent, responsive claims handling you can trust.",
    },
    {
      icon: Clock,
      title: "Same Day Quote",
      description: "Receive your personalized quote within hours, not days",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock assistance when you need it most",
    },
  ]

  const services = [
    {
      name: "Auto Insurance",
      icon: "🚗",
      image: "/images/auto-insurance.png",
      description: "Comprehensive vehicle protection",
    },
    {
      name: "Home Insurance",
      icon: "🏠",
      image: "/images/home-insurance.png",
      description: "Protect your most valuable asset",
    },
    {
      name: "Commercial Insurance",
      icon: "🏢",
      image: "/images/fleet-trucks.webp",
      description: "Fleet and commercial vehicle coverage",
    },
    {
      name: "Business Insurance",
      icon: "💼",
      image: "/images/business-insurance.png",
      description: "Comprehensive business protection",
    },
    {
      name: "Life Insurance",
      icon: "👨‍👩‍👧‍👦",
      image: "/images/childcare-insurance.png",
      description: "Secure your family's future",
    },
    {
      name: "Health Insurance",
      icon: "🏥",
      image: "/images/health-insurance.png",
      description: "Quality healthcare coverage",
    },
  ]

  const stats = [
    { number: "25000+", label: "Happy Customers" },
    { number: "12+", label: "Years Experience" },
    { number: "99.9%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative">
        <Carousel slides={heroSlides} autoPlay={true} interval={6000} />
      </section>

      {/* Features Section - Add background image */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=Insurance+Icons+Pattern"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AmeriTrust?</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Add images to service cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Insurance Services</h2>
            <p className="text-lg text-gray-600">Comprehensive coverage for every aspect of your life</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-all duration-300 cursor-pointer group card-hover overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Add background image */}
      <section className="py-16 bg-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/stats-background.jpeg"
            alt="Professional consultation representing our customer service"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-blue-600/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-green-100">Our commitment to excellence speaks for itself</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview Section - Add customer images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real stories from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David Richardson",
                location: "Atlanta, GA",
                image: "/images/customer-1.jpeg",
                review:
                  "AmeriTrust provided exceptional business insurance coverage for my consulting firm. Their professional approach and competitive rates made the decision easy.",
                service: "Business Insurance",
              },
              {
                name: "Sarah Mitchell",
                location: "Marietta, GA",
                image: "/images/customer-2.png",
                review:
                  "I saved over $900 on my auto insurance while getting better coverage. The team at AmeriTrust made the entire process seamless and stress-free.",
                service: "Auto Insurance",
              },
              {
                name: "Angela Thompson",
                location: "Kennesaw, GA",
                image: "/images/customer-3.png",
                review:
                  "When I needed comprehensive coverage for my family, AmeriTrust delivered exactly what we needed. Their customer service is truly outstanding.",
                service: "Family Insurance",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{testimonial.review}"</p>
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{testimonial.location}</p>
                  <p className="text-sm text-green-600 font-medium">{testimonial.service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/testimonials">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Add protection image */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/protection-cta.png"
            alt="Hands protecting a car - symbolizing insurance protection"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/85 to-green-600/85"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Protected?</h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Join thousands of satisfied customers who trust AmeriTrust with their insurance needs. Experience the
                peace of mind that comes with comprehensive coverage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/quote">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg btn-glow transition-all duration-300 hover:scale-105"
                  >
                    Get Free Quote Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black hover:bg-white hover:text-blue-600 px-8 py-4 text-lg transition-all duration-300"
                  >
                    Contact Us Today
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative w-full h-80 bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-20 w-20 text-white mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Your Protection</h3>
                  <p className="text-blue-100">Comprehensive coverage for what matters most</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
