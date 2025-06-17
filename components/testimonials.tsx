"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Rajesh Kumar",
    age: "45",
    location: "Sanchor",
    rating: 5,
    review:
      "Excellent service and very professional staff. Dr. Bhajan Lal explained everything clearly. The MRI scan was comfortable and results were quick.",
    image: "/placeholder.svg?height=60&width=60",
    service: "MRI Scan",
  },
  {
    name: "Priya Sharma",
    age: "32",
    location: "Kamalpura",
    rating: 5,
    review:
      "Very satisfied with the sonography service during my pregnancy. The facility is clean and modern. Highly recommend for medical imaging.",
    image: "/placeholder.svg?height=60&width=60",
    service: "Sonography",
  },
  {
    name: "Amit Patel",
    age: "38",
    location: "Sanchor",
    rating: 5,
    review:
      "Quick CT scan service with accurate results. The staff was helpful and the equipment is very advanced. Great experience overall.",
    image: "/placeholder.svg?height=60&width=60",
    service: "CT Scan",
  },
  {
    name: "Sunita Devi",
    age: "55",
    location: "Kamalpura",
    rating: 5,
    review:
      "Professional service and caring staff. Dr. Bhajan Lal is very experienced. The X-ray results were provided immediately.",
    image: "/placeholder.svg?height=60&width=60",
    service: "Digital X-Ray",
  },
  {
    name: "Vikram Singh",
    age: "42",
    location: "Sanchor",
    rating: 5,
    review:
      "Excellent color doppler service. The facility is well-maintained and the staff is knowledgeable. Highly recommended center.",
    image: "/placeholder.svg?height=60&width=60",
    service: "Color Doppler",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            What our patients say about their experience with our medical imaging services
          </p>
        </div>

        <div className="relative">
          {/* Main Testimonial Display */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Patient Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={testimonials[currentIndex].image || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Stars */}
                    <div className="flex justify-center md:justify-start mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "{testimonials[currentIndex].review}"
                    </blockquote>

                    {/* Patient Info */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-600">
                        Age {testimonials[currentIndex].age} • {testimonials[currentIndex].location}
                      </p>
                      <p className="text-blue-600 font-medium">Service: {testimonials[currentIndex].service}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Patients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">5★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Emergency Service</div>
          </div>
        </div>
      </div>
    </section>
  )
}
