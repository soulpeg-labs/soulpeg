"use client"

import { useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface SystemStatusBannerProps {
  operational: boolean
  message?: string
}

export function SystemStatusBanner({ operational, message }: SystemStatusBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const defaultMessage = operational
    ? "All staking operations are functioning normally."
    : "Some systems may be experiencing issues. Staking operations might be affected."

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl ${
        !operational 
          ? "bg-red-900/20 border border-red-800/50" 
          : "bg-green-900/20 border border-green-800/50"
      }`}
    >
      {!operational ? (
        <div className="text-red-400">⚠️</div>
      ) : (
        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${!operational ? "text-red-200" : "text-green-200"}`}>
          {!operational ? "System Alert" : "All Systems Operational"}
        </p>
        <p className={`text-sm ${!operational ? "text-red-300" : "text-green-300"}`}>
          {message || defaultMessage}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-white/5 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-neutral-400" />
      </button>
    </div>
  )
}
