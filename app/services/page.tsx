"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Eye, Heart, Activity, Clock, Shield, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const services = [
  {
    title: "MRI Scan",
    description: "High-resolution imaging for soft tissues using 1.5T Siemens MRI technology.",
    icon: Brain,
    image: "/images/mri-room.jpg",
    tests: [
      "Brain MRI & Brain Angiography",
      "Brain Venography & Brain Spectroscopy",
      "Neck & PNS Imaging",
      "Cervical, Dorsal & Lumbosacral Spine",
      "Whole Spine Screening",
      "Shoulder, Elbow & Wrist MRI",
    ],
    duration: "30-60 minutes",
    preparation: "Remove all metal objects, inform about pacemakers",
    href: "/services/mri",
  },
  {
    title: "Digital X-Ray",
    description: "Fast & accurate bone structure imaging with minimal radiation exposure.",
    icon: Zap,
    image: "/images/reception-clean.jpg",
    tests: [
      "All Routine X-Rays",
      "Chest X-Ray",
      "Bone & Joint X-Rays",
      "Barium Studies",
      "IVT / MCU / RGU",
      "HSG (Hysterosalpingography)",
    ],
    duration: "5-15 minutes",
    preparation: "No special preparation required",
    href: "/services/xray",
  },
  {
    title: "CT Scan",
    description: "3D imaging for detailed diagnostics using 96-slice multi-detector CT.",
    icon: Eye,
    image: "/images/ct-scanner.jpg",
    tests: [
      "CT Brain, Neck & Chest",
      "CT Abdomen Pelvis & CT I.V.P",
      "HRCT Temporal Bone & Chest",
      "3D Bone Reconstruction",
      "CT Angiography (All Types)",
      "CT Cisternography & Myelography",
    ],
    duration: "10-30 minutes",
    preparation: "Fasting required for contrast studies",
    href: "/services/ct",
  },
  {
    title: "Ultrasound",
    description: "Painless imaging for internal organs & pregnancy monitoring.",
    icon: Heart,
    image: "/images/ultrasound-examination.jpg",
    tests: [
      "Abdomen & Pelvis Sonography",
      "Obs & Gynec Ultrasound",
      "Transvaginal Sonography",
      "Thyroid & Neck Sonography",
      "Breast & Scrotal Sonography",
      "Musculoskeletal Sonography",
    ],
    duration: "20-45 minutes",
    preparation: "Full bladder required for pelvic scans",
    href: "/services/ultrasound",
  },
  {
    title: "Color Doppler",
    description: "Advanced blood flow analysis and vascular imaging studies.",
    icon: Activity,
    image: "/images/reception-festive.jpg",
    tests: [
      "Peripheral Arterial & Venous Doppler",
      "Foetal Doppler Studies",
      "Renal Doppler",
      "Carotid Doppler",
      "Scrotal Doppler",
      "Small Part Doppler",
    ],
    duration: "30-45 minutes",
    preparation: "No special preparation required",
    href: "/services/doppler",
  },
  {
    title: "Special Procedures",
    description: "Guided diagnostic and therapeutic medical procedures.",
    icon: Shield,
    image: "/images/reception-clean.jpg",
    tests: [
      "USG Guided Procedures",
      "F.N.A.C. & Biopsy",
      "Liver Abscess Aspiration",
      "Pleural / Ascitic Tapping",
      "Therapeutic Injections",
      "Image-Guided Interventions",
    ],
    duration: "30-60 minutes",
    preparation: "As advised by radiologist",
    href: "/services/procedures",
  },
]

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              Advanced Medical Imaging Services
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              Our Medical Services
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive diagnostic imaging services with expert radiologist Dr. Bhajan Lal (MBBS, MD Radiodiagnosis)
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Grid Layout: 1 column mobile, 2 columns tablet, 3 columns desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 bg-white border-gray-200 overflow-hidden"
                >
                  {/* Service Image */}
                  <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Icon Overlay */}
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <service.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4">
                    {/* Tests Available */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">Available Tests:</h4>
                      <div className="space-y-1">
                        {service.tests.slice(0, 4).map((test, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span className="leading-tight">{test}</span>
                          </div>
                        ))}
                        {service.tests.length > 4 && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{service.tests.length - 4} more tests available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <br />
                        <span className="text-xs">{service.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Preparation:</span>
                        <br />
                        <span className="text-xs">{service.preparation}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={service.href} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 sm:py-3">
                        View All Tests & Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 lg:pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why Choose Our Center?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Excellence in medical imaging with patient-centered care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <Award className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">Expert Radiologist</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Dr. Bhajan Lal - MBBS, MD Radiodiagnosis
                </p>
              </div>
              <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-green-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">Latest Technology</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">Siemens 1.5T MRI & 96-Slice CT Scanner</p>
              </div>
              <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-purple-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">Quick Results</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">Fast turnaround with detailed reports</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              Need Expert Consultation?
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
              Contact our expert team for detailed consultation and appointment scheduling
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 lg:px-8 w-full sm:w-auto text-sm sm:text-base"
                >
                  Contact for Details
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-4 sm:px-6 lg:px-8 w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <a href="tel:+919460991212">Call: +91 94609 91212</a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}
