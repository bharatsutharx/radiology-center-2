import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CTPage() {
  const ctTypes = [
    {
      name: "Head CT",
      description: "Brain imaging for trauma, stroke, and neurological conditions",
      duration: "10-15 minutes",
      preparation: "Remove metal objects, contrast may be used",
    },
    {
      name: "Chest CT",
      description: "Lung and heart imaging for cancer screening and diagnosis",
      duration: "15-20 minutes",
      preparation: "Breath-holding instructions, possible contrast",
    },
    {
      name: "Abdominal CT",
      description: "Detailed imaging of abdominal organs and structures",
      duration: "20-30 minutes",
      preparation: "Fasting required, oral contrast administration",
    },
    {
      name: "CT Angiography",
      description: "Blood vessel imaging with contrast enhancement",
      duration: "30-45 minutes",
      preparation: "IV contrast, kidney function assessment",
    },
  ]

  const benefits = [
    "Fast imaging for emergency cases",
    "Excellent bone and organ detail",
    "3D reconstruction capability",
    "Wide availability and accessibility",
    "Cost-effective diagnostic tool",
    "Minimal patient positioning required",
  ]

  const conditions = [
    "Traumatic injuries and fractures",
    "Cancer detection and staging",
    "Pulmonary embolism",
    "Kidney stones",
    "Appendicitis diagnosis",
    "Stroke assessment",
    "Internal bleeding detection",
    "Organ abnormalities",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-600 rounded-full">
                <Eye className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">CT Scan Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced Computed Tomography for rapid, detailed cross-sectional imaging and emergency diagnostics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Schedule CT Scan
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Emergency Available
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Types of CT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">CT Scan Types</h2>
            <p className="text-xl text-gray-600">Comprehensive CT imaging for various medical conditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ctTypes.map((type, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-600"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
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
                  Benefits of CT Imaging
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
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <AlertCircle className="h-6 w-6" />
                  Conditions We Diagnose
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a CT Scan?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Fast, accurate CT imaging available for routine and emergency cases
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Book CT Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600"
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
