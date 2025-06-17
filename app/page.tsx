"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ServiceHighlights from "@/components/service-highlights"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"
import ChatbotWidget from "@/components/chatbot/chatbot-widget"

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <ServiceHighlights />
        <Testimonials />
        <Footer />
        <ChatbotWidget />
      </div>
    </PageTransition>
  )
}
