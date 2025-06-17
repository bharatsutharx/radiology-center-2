import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import RouteLoader from "@/components/route-loader" // 👈 this is client component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dr. Bhajan Sonography & Imaging Center",
  description:
    "Advanced medical imaging services including 1.5T MRI, 96 Slice CT Scan, Digital X-Ray, Sonography, and Colour Doppler with expert radiologist Dr. Bhajan Lal.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RouteLoader /> {/* client component inside server layout ✅ */}
        {children}
      </body>
    </html>
  )
}
