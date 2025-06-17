"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "./loading-spinner"
import Container from "@/components/ui/container"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  const handleNavigation = async (href: string) => {
    if (window.location.pathname === href) return
    setIsLoading(true)
    setIsOpen(false)
    await new Promise((res) => setTimeout(res, 100))
    router.push(href)
    setTimeout(() => setIsLoading(false), 500)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <nav
        className={`bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-shadow border-b ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <Container>
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-shadow group-hover:shadow-md">
                  <Image
                    src="/images/logo.jpg"
                    alt="Dr. Bhajan Logo"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full scale-110 group-hover:scale-125 transition-transform"
                    priority
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium relative group transition"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                </button>
              ))}
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Menu */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-100 animate-in slide-in-from-top-2">
              <div className="px-3 py-2 space-y-1 bg-white">
                {navLinks.map(({ label, href }) => (
                  <button
                    key={href}
                    onClick={() => handleNavigation(href)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                  >
                    {label}
                  </button>
                ))}
                <Link href="/login" className="block w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs hover:bg-blue-50 hover:border-blue-300"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </nav>
    </>
  )
}
