import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Shield, CheckCircle, AlertCircle, Users } from "lucide-react"
import Link from "next/link"

export default function XRayPage() {
  const xrayTypes = [
    {
      name: "Chest X-Ray",
      description: "Detect lung conditions, heart problems, and chest injuries",
      duration: "5-10 minutes",
      preparation: "Remove jewelry and metal objects",
    },
    {
      name: "Bone X-Ray",
      description: "Diagnose fractures, arthritis, and bone infections",
      duration: "10-15 minutes",
      preparation: "No special preparation required",
    },
    {
      name: "Abdominal X-Ray",
      description: "Examine digestive tract and detect blockages",
      duration: "10-15 minutes",
      preparation: "May require fasting",
    },
    {
      name: "Dental X-Ray",
      description: "Oral health assessment and dental problem detection",
      duration: "5-10 minutes",
      preparation: "Remove dental appliances",
    },
  ]

  const benefits = [
    "Quick and painless procedure",
    "Immediate results available",
    "Cost-effective diagnostic tool",
    "Minimal radiation exposure",
    "No recovery time needed",
    "Widely available technology",
  ]

  const conditions = [
    "Bone fractures and breaks",
    "Pneumonia and lung infections",
    "Heart enlargement",
    "Arthritis and joint problems",
    "Kidney stones",
    "Digestive tract issues",
    "Dental problems",
    "Foreign object detection",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Digital X-Ray Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced digital X-ray imaging with minimal radiation exposure and immediate results for accurate
              diagnosis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Book X-Ray Appointment
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Same Day Results
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Types of X-Ray */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of X-Ray Examinations</h2>
            <p className="text-xl text-gray-600">Comprehensive X-ray services for various medical conditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {xrayTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    {type.name}
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Duration:</span>
                      <Badge variant="secondary">{type.duration}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Preparation:</span>
                      <span className="text-sm text-gray-500">{type.preparation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <Card className="shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-6 w-6" />
                  Benefits of Digital X-Ray
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Conditions Diagnosed */}
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <AlertCircle className="h-6 w-6" />
                  Conditions We Diagnose
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Procedure Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Expect</h2>
            <p className="text-xl text-gray-600">Simple, quick, and comfortable X-ray procedure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Registration</h3>
                <p className="text-gray-600">Check-in and provide medical history information</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Preparation</h3>
                <p className="text-gray-600">Remove metal objects and position for imaging</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Imaging</h3>
                <p className="text-gray-600">Quick X-ray capture with immediate digital results</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Information */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-blue-600" />
                Safety & Radiation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Radiation Safety</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Minimal radiation exposure with digital technology</li>
                    <li>• Lead aprons provided for protection when needed</li>
                    <li>• Pregnancy screening before examination</li>
                    <li>• Radiation dose monitoring and optimization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation Guidelines</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Remove all jewelry and metal objects</li>
                    <li>• Wear comfortable, loose-fitting clothing</li>
                    <li>• Inform staff of any pregnancy possibility</li>
                    <li>• Follow specific fasting instructions if required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your X-Ray?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today for quick, accurate, and safe digital X-ray imaging
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Book Appointment Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
