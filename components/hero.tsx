"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    image: "/images/mri-room.jpg",
    title: "MOST ADVANCED",
    highlight: "MRI TECHNOLOGY",
    subtitle: "1.5 Tesla Siemens MRI",
    description: "HAS ARRIVED!",
    equipment: "1.5T MRI Scanner",
  },
  {
    image: "/images/ct-scanner.jpg",
    title: "CUTTING-EDGE",
    highlight: "CT IMAGING",
    subtitle: "96 Slice Multi-Detector CT",
    description: "NOW AVAILABLE!",
    equipment: "Multi-Slice CT Scanner",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const currentHero = heroSlides[currentSlide]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pb-4 sm:pb-6 md:pb-8 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - Equipment Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full">
              <Image
                src={currentHero.image || "/placeholder.svg"}
                alt={currentHero.equipment}
                fill
                className="object-cover rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl transition-all duration-1000"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
              {/* Equipment Label */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 text-center">{currentHero.equipment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Main Headline */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight">
                  {currentHero.title}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-600 leading-tight">
                  {currentHero.highlight}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-500 font-light">
                  {currentHero.subtitle}
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-400 mt-2 lg:mt-4">
                  {currentHero.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start pt-2 sm:pt-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Contact for More
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  >
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12 space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
