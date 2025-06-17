import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, CheckCircle, AlertCircle, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function MRIPage() {
  const mriTypes = [
    {
      name: "Brain MRI",
      description: "Detailed imaging of brain structures, tumors, and neurological conditions",
      duration: "30-60 minutes",
      preparation: "Remove all metal objects, may require contrast",
    },
    {
      name: "Spine MRI",
      description: "Comprehensive spinal cord and vertebrae examination",
      duration: "45-60 minutes",
      preparation: "Comfortable clothing, no metal implants disclosure",
    },
    {
      name: "Joint MRI",
      description: "Detailed soft tissue imaging of knees, shoulders, and other joints",
      duration: "30-45 minutes",
      preparation: "Remove jewelry, inform about any implants",
    },
    {
      name: "Cardiac MRI",
      description: "Heart structure and function assessment",
      duration: "45-90 minutes",
      preparation: "Fasting may be required, ECG monitoring",
    },
  ]

  const benefits = [
    "No ionizing radiation exposure",
    "Exceptional soft tissue contrast",
    "Multi-planar imaging capability",
    "Non-invasive procedure",
    "Detailed anatomical information",
    "Functional imaging possible",
  ]

  const conditions = [
    "Brain tumors and lesions",
    "Spinal cord injuries",
    "Joint and ligament tears",
    "Heart conditions",
    "Liver and kidney diseases",
    "Multiple sclerosis",
    "Stroke assessment",
    "Cancer staging and monitoring",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-purple-600 rounded-full">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">MRI Imaging Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced Magnetic Resonance Imaging for detailed soft tissue examination with no radiation exposure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Schedule MRI Scan
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Radiation-Free Imaging
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Types of MRI */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">MRI Examination Types</h2>
            <p className="text-xl text-gray-600">Comprehensive MRI services for detailed medical imaging</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mriTypes.map((type, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-600"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
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
                  Advantages of MRI
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
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <AlertCircle className="h-6 w-6" />
                  Conditions We Diagnose
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">MRI Procedure Process</h2>
            <p className="text-xl text-gray-600">What to expect during your MRI examination</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Screening</h3>
                <p className="text-gray-600">Metal screening and medical history review</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Preparation</h3>
                <p className="text-gray-600">Change into gown and remove all metal objects</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Scanning</h3>
                <p className="text-gray-600">Lie still during the imaging process</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Results</h3>
                <p className="text-gray-600">Detailed images reviewed by radiologist</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Information */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-purple-600" />
                MRI Safety & Preparation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Considerations</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• No radiation exposure - completely safe</li>
                    <li>• Strong magnetic field requires metal screening</li>
                    <li>• Inform staff of any implants or devices</li>
                    <li>• Claustrophobia support available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation Guidelines</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Remove all jewelry and metal objects</li>
                    <li>• Wear comfortable, metal-free clothing</li>
                    <li>• Inform about pacemakers or implants</li>
                    <li>• Follow contrast preparation if required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Schedule Your MRI Today</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get detailed, radiation-free imaging with our state-of-the-art MRI technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Book MRI Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600"
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
