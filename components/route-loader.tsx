"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/loading-spinner"

const RouteLoader = () => {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500) // minimum spinner time

    return () => clearTimeout(timeout)
  }, [pathname])

  return loading ? <LoadingSpinner /> : null
}

export default RouteLoader
