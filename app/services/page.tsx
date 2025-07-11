import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Home, Building, Briefcase, Heart, Shield, Users, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ServicesPage() {
  const services = [
    {
      icon: Car,
      title: "Auto Insurance",
      image: "/images/auto-insurance.png",
      description:
        "Comprehensive coverage for your vehicle including liability, collision, and comprehensive protection.",
      features: [
        "Liability Coverage",
        "Collision Protection",
        "Comprehensive Coverage",
        "Uninsured Motorist",
        "Roadside Assistance",
      ],
    },
    {
      icon: Home,
      title: "Home Insurance",
      image: "/images/home-insurance.png",
      description: "Protect your home and belongings with our comprehensive homeowners insurance policies.",
      features: [
        "Dwelling Coverage",
        "Personal Property",
        "Liability Protection",
        "Additional Living Expenses",
        "Natural Disaster Coverage",
      ],
    },
    {
      icon: Building,
      title: "Commercial Insurance",
      image: "/images/fleet-trucks.webp",
      description: "Tailored insurance solutions for businesses of all sizes and industries.",
      features: [
        "General Liability",
        "Property Coverage",
        "Workers Compensation",
        "Professional Liability",
        "Cyber Liability",
      ],
    },
    {
      icon: Briefcase,
      title: "Business Insurance",
      image: "/images/business-insurance.png",
      description: "Comprehensive business protection including liability, property, and specialized coverage.",
      features: [
        "Business Interruption",
        "Equipment Coverage",
        "Key Person Insurance",
        "Employment Practices",
        "Directors & Officers",
      ],
    },
    {
      icon: Heart,
      title: "Life Insurance",
      image: "/images/childcare-insurance.png",
      description: "Secure your family's financial future with our life insurance options.",
      features: [
        "Term Life Insurance",
        "Whole Life Insurance",
        "Universal Life",
        "Final Expense",
        "Group Life Insurance",
      ],
    },
    {
      icon: Shield,
      title: "Health Insurance",
      image: "/images/health-insurance.png",
      description: "Quality healthcare coverage options for individuals and families.",
      features: [
        "Individual Plans",
        "Family Coverage",
        "Group Health Plans",
        "Short-term Medical",
        "Supplemental Insurance",
      ],
    },
    {
      icon: Users,
      title: "Group Insurance",
      image: "/images/business-insurance.png",
      description: "Employee benefit packages and group insurance solutions for businesses.",
      features: ["Group Health", "Group Life", "Disability Insurance", "Dental & Vision", "Retirement Plans"],
    },
    {
      icon: Truck,
      title: "Commercial Auto",
      image: "/images/fleet-trucks.webp",
      description: "Specialized coverage for commercial vehicles and fleet operations.",
      features: [
        "Fleet Coverage",
        "Commercial Liability",
        "Cargo Insurance",
        "Non-Trucking Liability",
        "Physical Damage",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/about-bread.png"
            alt="Professional insurance consultation meeting with AmeriTrust team and clients"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Insurance Services</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Comprehensive insurance solutions designed to protect what matters most to you and your business
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative h-48">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <service.icon className="absolute top-4 left-4 h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Get Quote</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our experts can create a tailored insurance package that fits your unique needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Contact Our Experts
              </Button>
            </Link>
            <Link href="/quote">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600"
              >
                Get Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
