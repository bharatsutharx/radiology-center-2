import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Shield, Clock, Brain, Eye, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const trustIndicators = [
  {
    icon: Award,
    title: "Expert Radiologist",
    description: "Dr. Bhajan Lal - MBBS, MD Radiodiagnosis with extensive experience in medical imaging",
  },
  {
    icon: Shield,
    title: "Advanced Technology",
    description: "Siemens 1.5T MRI, 96-Slice CT Scanner, Digital X-Ray and Color Doppler systems",
  },
  {
    icon: Clock,
    title: "Quick Results",
    description: "Fast turnaround times for urgent diagnostic needs with accurate reporting",
  },
]

const services = [
  {
    title: "1.5T MRI Scan",
    description: "High-resolution magnetic resonance imaging for detailed soft tissue analysis",
    icon: Brain,
    image: "/images/mri-room.jpg",
  },
  {
    title: "Multi-Slice CT",
    description: "96-slice computed tomography for rapid cross-sectional imaging",
    icon: Eye,
    image: "/images/ct-scanner.jpg",
  },
  {
    title: "Sonography",
    description: "Comprehensive ultrasound imaging for various medical conditions",
    icon: Heart,
    image: "/images/ultrasound-examination.jpg",
  },
]

export default function ServiceHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Indicators */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted healthcare with modern technology and expert care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive diagnostic imaging services with state-of-the-art equipment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <service.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href="/services">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
