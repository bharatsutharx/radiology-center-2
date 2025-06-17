import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, CheckCircle, AlertCircle, Baby } from "lucide-react"
import Link from "next/link"

export default function UltrasoundPage() {
  const ultrasoundTypes = [
    {
      name: "Pregnancy Ultrasound",
      description: "Fetal development monitoring and pregnancy health assessment",
      duration: "20-30 minutes",
      preparation: "Full bladder may be required for early pregnancy",
    },
    {
      name: "Abdominal Ultrasound",
      description: "Liver, gallbladder, kidney, and pancreas examination",
      duration: "30-45 minutes",
      preparation: "Fasting for 8-12 hours before examination",
    },
    {
      name: "Cardiac Echo",
      description: "Heart structure and function assessment",
      duration: "30-60 minutes",
      preparation: "No special preparation required",
    },
    {
      name: "Thyroid Ultrasound",
      description: "Thyroid gland examination for nodules and abnormalities",
      duration: "15-30 minutes",
      preparation: "No preparation needed",
    },
  ]

  const benefits = [
    "Completely safe with no radiation",
    "Real-time imaging capability",
    "Non-invasive and painless",
    "Safe during pregnancy",
    "Cost-effective examination",
    "Immediate results available",
  ]

  const conditions = [
    "Pregnancy monitoring",
    "Gallbladder stones",
    "Kidney stones and cysts",
    "Heart valve problems",
    "Thyroid nodules",
    "Liver abnormalities",
    "Pelvic conditions",
    "Blood flow assessment",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-pink-600 rounded-full">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ultrasound Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Safe, real-time imaging using sound waves for pregnancy monitoring and organ examination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Book Ultrasound
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Baby className="mr-2 h-5 w-5" />
                Pregnancy Safe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Ultrasound */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ultrasound Examinations</h2>
            <p className="text-xl text-gray-600">Comprehensive ultrasound services for various medical needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ultrasoundTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-pink-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
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
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <CheckCircle className="h-6 w-6" />
                  Benefits of Ultrasound
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Conditions Diagnosed */}
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <AlertCircle className="h-6 w-6" />
                  Conditions We Examine
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-600 rounded-full flex-shrink-0"></div>
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
      <section className="py-16 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Schedule Your Ultrasound</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Safe, comfortable ultrasound examinations with immediate results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Book Ultrasound
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-pink-600"
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
