import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Award, TrendingUp, Eye, Target } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "We build lasting relationships based on honesty, transparency, and reliability.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your needs come first. We tailor our services to provide the best solutions for you.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from service to coverage options.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We embrace technology and innovation to make insurance simple and accessible.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/contact-bc.png"
            alt="Professional city skyline representing AmeriTrust's strong presence and stability in the insurance industry"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AmeriTrust</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Protecting families and businesses for over two decades with comprehensive insurance solutions
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide comprehensive, affordable insurance solutions that protect what matters most to our clients.
                We are committed to delivering exceptional service, building lasting relationships, and ensuring peace
                of mind for individuals, families, and businesses across America.
              </p>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the most trusted insurance partner in America, known for our integrity, innovation, and unwavering
                commitment to our clients' success. We envision a future where insurance is simple, accessible, and
                tailored to each individual's unique needs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">
                  Founded in 2012, AmeriTrust Insurance Group began with a simple mission: to make quality insurance
                  accessible and affordable for everyone.
                </p>
                <p className="mb-6">
                  What started as a small business has grown into one of the region's most trusted insurance
                  providers. Our founder, Mr. Wilson Wanguhu, recognized that many people were underinsured or paying too much
                  for inadequate coverage.
                </p>
                <p>
                  Today, AmeriTrust Insurance Group continues to evolve, embracing new technologies and expanding our
                  services while maintaining the personal touch that has defined us from the beginning.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/branch-img-2.png"
                alt="Modern corporate buildings representing AmeriTrust's growth and professional evolution"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <value.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
