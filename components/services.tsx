"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Eye, Heart, Activity, Stethoscope } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "1.5T MRI Scan",
    description: "High-field Magnetic Resonance Imaging for detailed analysis",
    icon: Brain,
    features: ["Brain & Spine Imaging", "Joint & Muscle Scans", "Angiography", "Spectroscopy"],
    duration: "30-60 min",
    preparation: "Remove metal objects",
    href: "/services/mri",
  },
  {
    title: "Multi-Slice CT Scan",
    description: "96 Slice MDCT for rapid, high-resolution imaging",
    icon: Eye,
    features: ["Emergency Diagnostics", "3D Reconstruction", "Angiography", "Low Radiation"],
    duration: "10-30 min",
    preparation: "Fasting may be required",
    href: "/services/ct",
  },
  {
    title: "Sonography",
    description: "Comprehensive ultrasound imaging services",
    icon: Heart,
    features: ["Pregnancy Monitoring", "Abdominal Scans", "Thyroid & Neck", "Musculoskeletal"],
    duration: "20-45 min",
    preparation: "Full bladder for some scans",
    href: "/services/ultrasound",
  },
  {
    title: "Digital X-Ray",
    description: "Digital radiography with immediate results",
    icon: Zap,
    features: ["Routine X-Rays", "Barium Studies", "IVT/MCU/RGU", "HSG"],
    duration: "5-15 min",
    preparation: "No special preparation",
    href: "/services/xray",
  },
  {
    title: "Colour Doppler",
    description: "Advanced vascular imaging with flow mapping",
    icon: Activity,
    features: ["Arterial & Venous", "Foetal Doppler", "Carotid Studies", "Renal Doppler"],
    duration: "30-45 min",
    preparation: "No special preparation",
    href: "/services/doppler",
  },
  {
    title: "Special Procedures",
    description: "Specialized diagnostic and therapeutic procedures",
    icon: Stethoscope,
    features: ["USG Guided Procedures", "FNAC & Biopsy", "Aspiration", "Therapeutic Procedures"],
    duration: "30-60 min",
    preparation: "As advised by doctor",
    href: "/services/procedures",
  },
]

export default function Services() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive diagnostic imaging services with expert radiologist care
          </p>
          <Badge variant="secondary" className="mt-4">
            Dr. Bhajan Lal - MBBS, MD Radiodiagnosis
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-white border-gray-200">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Services Include:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div>
                    <span className="font-medium">Duration:</span>
                    <br />
                    {service.duration}
                  </div>
                  <div>
                    <span className="font-medium">Preparation:</span>
                    <br />
                    {service.preparation}
                  </div>
                </div>

                <Link href={service.href}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need More Information?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact our expert team for detailed consultation and appointment scheduling
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Contact for Details
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                <a href="tel:+919460991212">Call: +91 94609 91212</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
