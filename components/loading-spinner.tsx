"use client"

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Outer ring */}
        <div className="absolute inset-0 w-12 h-12 border-2 border-purple-200 rounded-full animate-pulse"></div>

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute mt-20 text-gray-600 font-medium animate-pulse">Loading...</div>
    </div>
  )
}
