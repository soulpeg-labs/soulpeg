import { Button } from "@/components/ui/button"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DollarSignIcon,
  LayersIcon,
  LockIcon,
  BarChartIcon,
  WalletIcon,
  SettingsIcon,
  ListChecksIcon,
} from "lucide-react"
import Link from "next/link"

// A more detailed, representative mockup of the dashboard
const RepresentativeDashboardMockup = () => (
  <div className="bg-neutral-800/60 border border-neutral-700/80 rounded-xl shadow-2xl p-3 md:p-4 aspect-[16/10] overflow-hidden flex flex-col">
    {/* Header part of mockup */}
    <div className="flex justify-between items-center mb-2 md:mb-3 px-1 md:px-2 pt-1">
      <div className="flex items-center space-x-1.5">
        <WalletIcon className="h-5 w-5 text-blue-500 opacity-80" />
        <div className="w-20 h-3 bg-neutral-700 rounded-sm"></div>
      </div>
      <div className="flex items-center space-x-1.5">
        <div className="w-16 h-5 bg-neutral-700/80 rounded-sm flex items-center justify-center">
          <SettingsIcon className="h-3 w-3 text-neutral-500" />
        </div>
        <div className="w-5 h-5 bg-blue-600/70 rounded-full"></div>
      </div>
    </div>

    {/* Main content area of mockup */}
    <div className="flex-grow grid grid-cols-12 gap-2 md:gap-3 overflow-hidden">
      {/* Left panel (e.g., balances, stake form) - takes more space */}
      <div className="col-span-7 md:col-span-8 bg-neutral-700/30 rounded-lg p-2 md:p-3 space-y-2 md:space-y-3 flex flex-col">
        {/* Balances Section */}
        <div className="bg-neutral-600/40 p-2 rounded-md space-y-1.5">
          <div className="h-3 w-1/3 bg-neutral-500/50 rounded-sm"></div> {/* Title: Your Balances */}
          <div className="flex justify-between items-center">
            <div className="w-2/5 h-2.5 bg-neutral-500/40 rounded-sm"></div>
            <div className="w-1/4 h-4 bg-neutral-500/70 rounded-sm"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="w-1/2 h-2.5 bg-neutral-500/40 rounded-sm"></div>
            <div className="w-1/3 h-4 bg-neutral-500/70 rounded-sm"></div>
          </div>
        </div>

        {/* Staking Form Section */}
        <div className="bg-neutral-600/40 p-2 rounded-md space-y-1.5 flex-grow flex flex-col justify-between">
          <div>
            <div className="h-3 w-1/2 bg-neutral-500/50 rounded-sm mb-1"></div> {/* Title: Stake USDC */}
            <div className="h-6 bg-neutral-500/30 rounded-md border border-neutral-500/40"></div> {/* Input field */}
            <div className="flex space-x-1 mt-1.5">
              <div className="flex-1 h-5 bg-blue-500/30 rounded-sm border border-blue-500/50"></div>
              <div className="flex-1 h-5 bg-neutral-500/30 rounded-sm"></div>
              <div className="flex-1 h-5 bg-neutral-500/30 rounded-sm"></div>
            </div>
          </div>
          <div className="h-6 bg-blue-600/70 rounded-md mt-1.5"></div> {/* Stake Button */}
        </div>
      </div>

      {/* Right panel (e.g., lock status, active stakes, mini chart) */}
      <div className="col-span-5 md:col-span-4 bg-neutral-700/30 rounded-lg p-2 md:p-3 space-y-2 md:space-y-3 flex flex-col">
        {/* Lock Status */}
        <div className="bg-neutral-600/40 p-1.5 rounded-md space-y-1">
          <div className="flex items-center space-x-1">
            <LockIcon className="h-2.5 w-2.5 text-orange-400 opacity-80" />
            <div className="h-2.5 w-1/3 bg-neutral-500/50 rounded-sm"></div> {/* Title: Lock Status */}
          </div>
          <div className="h-4 w-3/4 bg-orange-400/40 rounded-sm mx-auto"></div>
          <div className="h-2 w-1/2 bg-neutral-500/40 rounded-sm mx-auto"></div>
        </div>
        {/* Active Stakes */}
        <div className="bg-neutral-600/40 p-1.5 rounded-md space-y-1">
          <div className="flex items-center space-x-1">
            <ListChecksIcon className="h-2.5 w-2.5 text-green-400 opacity-80" />
            <div className="h-2.5 w-1/2 bg-neutral-500/50 rounded-sm"></div> {/* Title: Active Stakes */}
          </div>
          <div className="h-3 w-full bg-neutral-500/30 rounded-sm"></div>
          <div className="h-3 w-full bg-neutral-500/30 rounded-sm"></div>
        </div>
        {/* Mini Chart */}
        <div className="bg-neutral-600/40 p-1.5 rounded-md flex-grow flex flex-col justify-end items-center">
          <div className="w-full h-full max-h-[40px] flex items-end space-x-0.5 px-0.5">
            {[0.4, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4].map((val, i) => (
              <div key={i} className="flex-1 bg-blue-500/50 rounded-t-sm" style={{ height: `${val * 100}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="text-center text-[0.6rem] text-neutral-500/80 pt-1.5 md:pt-2">Dashboard Preview</p>
  </div>
)

export function DashboardIntroV3() {
  return (
    <section className="py-16 md:py-24 bg-neutral-800/30 border-y border-neutral-700/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left Column: Dashboard Visual */}
          <div className="relative order-2 lg:order-1">
            <RepresentativeDashboardMockup />
            {/* Optional: Add a subtle glow or background element */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Right Column: Description & CTA */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-neutral-100 mb-6">
              Your Command Center for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Stable Yield
              </span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed">
              The SoulPeg Dashboard offers a seamless and intuitive experience to manage your sUSDC staking. Monitor
              your investments, track earnings, and access powerful analytics all in one place.
            </p>
            <ul className="space-y-3 text-left mb-10 text-neutral-300">
              {[
                { icon: DollarSignIcon, text: "Effortlessly stake and manage your sUSDC." },
                { icon: BarChartIcon, text: "Visualize your portfolio growth with clear analytics." },
                { icon: LayersIcon, text: "Track active stakes, lock periods, and earned yield." },
                { icon: CheckCircleIcon, text: "Secure and transparent on-chain operations." },
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon className="h-5 w-5 text-blue-400 mr-3 shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg hover:shadow-blue-500/50 transition-all px-8 py-3"
              asChild
            >
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRightIcon className="ml-2.5 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
