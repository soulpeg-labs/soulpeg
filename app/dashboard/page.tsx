"use client"

import { Suspense } from "react"
import UserDashboard from "@/components/user-dashboard"
import { DashboardHeader } from "@/components/soulpeg/dashboard/dashboard-header"

/**
 * Dashboard page with new design but keeping the existing functionality
 * Preserves SSR stability and avoids hydration mismatch
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-neutral-900 text-neutral-100 selection:bg-blue-500 selection:text-white">
      <DashboardHeader />
      <main className="flex-1 container mx-auto max-w-screen-xl px-4 md:px-6 py-8 md:py-12">
        <Suspense fallback={null}>
          <UserDashboard />
        </Suspense>
      </main>
      {/* Minimal footer for dashboard */}
      <footer className="border-t border-neutral-700/60 bg-neutral-900 mt-12">
        <div className="container mx-auto max-w-screen-xl px-4 md:px-6 py-6 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} SoulPeg Labs. All rights reserved.
        </div>
      </footer>
    </div>
  )
}