import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ZapIcon } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
      {/* Background Gradient */}
      <div aria-hidden="true" className="absolute inset-0 z-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div className="h-56 bg-gradient-to-br from-blue-500 to-purple-500 blur-[106px] dark:from-blue-700"></div>
        <div className="h-32 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600"></div>
      </div>
      <div />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="inline-block mb-6">
          <Link
            href="/announcements/new-feature"
            className="group flex items-center rounded-full bg-neutral-800/80 p-1.5 pr-4 sm:p-1.5 sm:pr-3 hover:bg-neutral-700/90 transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600 shadow-lg"
          >
            <span className="rounded-full bg-blue-500 px-3 py-1.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white group-hover:bg-blue-400 transition-colors">
              New
            </span>
            <span className="ml-3 sm:ml-4 text-xs sm:text-sm text-neutral-200 font-medium">
              <span className="hidden sm:inline">Introducing v2 Staking Pools & Rewards!</span>
              <span className="sm:hidden">v2 Staking Pools & Rewards!</span>
            </span>
            <ArrowRightIcon className="ml-2 sm:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-neutral-50 via-neutral-200 to-neutral-400">
          The Future of Stable Yield.
          <br />
          <span className="block mt-2 md:mt-4">Powered by SoulPeg.</span>
        </h1>
        <p className="mt-8 max-w-xl md:max-w-2xl mx-auto text-lg md:text-xl text-neutral-300">
          SoulPeg Labs pioneers soul-bound sUSDC stablecoins, offering secure, transparent, and sustainable yield
          generation on the Binance Smart Chain.
        </p>
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            // size="xl" // Removed size="xl" to allow custom padding to take full effect
            className="h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto px-10 py-4 rounded-md"
            asChild
          >
            <Link href="/dashboard">
              Launch Staking App
              <ZapIcon className="ml-2.5 h-5 w-5" />
            </Link> 
          </Button>
          <Button
            // size="xl" // Removed size="xl"
            className="h-auto bg-neutral-900 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all w-full sm:w-auto px-10 py-4 rounded-md"
            asChild
          >
            <Link href="/docs" target="_blank">
              Read Documentation
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
