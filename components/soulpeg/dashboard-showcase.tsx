import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, BarChart2Icon, DollarSignIcon, LayersIcon, ZapIcon, EyeIcon } from "lucide-react"
import Link from "next/link"

// Simplified mockups as components or images
const MockupOverview = () => (
  <div className="p-4 bg-neutral-800/70 rounded-lg border border-neutral-700 aspect-[16/10] flex flex-col justify-center items-center space-y-3">
    <div className="flex space-x-2 w-full px-2">
      <div className="flex-1 p-2 bg-neutral-700/50 rounded text-center">
        <DollarSignIcon className="h-5 w-5 mx-auto text-blue-400 mb-1" />
        <p className="text-xs text-neutral-300">Total Staked</p>
        <p className="text-sm font-bold text-neutral-100">$1.23M</p>
      </div>
      <div className="flex-1 p-2 bg-neutral-700/50 rounded text-center">
        <LayersIcon className="h-5 w-5 mx-auto text-purple-400 mb-1" />
        <p className="text-xs text-neutral-300">Your sUSDC</p>
        <p className="text-sm font-bold text-neutral-100">1,000</p>
      </div>
    </div>
    <div className="w-full px-2 py-2 bg-neutral-700/50 rounded text-center">
      <ZapIcon className="h-5 w-5 mx-auto text-green-400 mb-1" />
      <p className="text-xs text-neutral-300">Available USDC</p>
      <p className="text-sm font-bold text-neutral-100">38,050</p>
    </div>
    <p className="text-xs text-neutral-500 mt-2">Simplified Overview</p>
  </div>
)

const MockupStakingForm = () => (
  <div className="p-4 bg-neutral-800/70 rounded-lg border border-neutral-700 aspect-[16/10] flex flex-col justify-center items-center space-y-3">
    <input
      type="text"
      placeholder="Enter Amount (USDC)"
      className="w-full p-2 rounded bg-neutral-700/50 border border-neutral-600 text-xs text-neutral-300 placeholder-neutral-500"
      disabled
    />
    <p className="text-xs text-neutral-400 self-start">Select Lock Period:</p>
    <div className="flex space-x-2 w-full">
      <button className="flex-1 p-2 text-xs bg-blue-500/30 border border-blue-500/50 text-blue-300 rounded">
        7 Days
      </button>
      <button className="flex-1 p-2 text-xs bg-neutral-700/50 border border-neutral-600 text-neutral-400 rounded">
        30 Days
      </button>
      <button className="flex-1 p-2 text-xs bg-neutral-700/50 border border-neutral-600 text-neutral-400 rounded">
        90 Days
      </button>
    </div>
    <button className="w-full p-2 text-xs bg-blue-600 text-white rounded mt-2">Stake USDC</button>
    <p className="text-xs text-neutral-500 mt-2">Simplified Staking Form</p>
  </div>
)

const MockupAnalytics = () => (
  <div className="p-4 bg-neutral-800/70 rounded-lg border border-neutral-700 aspect-[16/10] flex flex-col justify-center items-center">
    <BarChart2Icon className="h-10 w-10 text-amber-400 mb-3" />
    <div className="w-full h-16 bg-neutral-700/50 rounded flex items-end p-1 space-x-1">
      {[0.3, 0.5, 0.4, 0.7, 0.6].map((h, i) => (
        <div key={i} className="flex-1 bg-amber-500/70 rounded-t-sm" style={{ height: `${h * 100}%` }}></div>
      ))}
    </div>
    <p className="text-xs text-neutral-400 mt-2">Track Your Growth</p>
    <div className="w-full mt-2 text-xs space-y-1">
      <div className="flex justify-between p-1 bg-neutral-700/40 rounded">
        <span className="text-neutral-400">Jun 4 Deposit</span> <span className="text-green-400">+$1000</span>
      </div>
      <div className="flex justify-between p-1 bg-neutral-700/40 rounded">
        <span className="text-neutral-400">Jun 3 Yield</span> <span className="text-green-400">+$5.20</span>
      </div>
    </div>
    <p className="text-xs text-neutral-500 mt-2">Simplified Analytics & History</p>
  </div>
)

const features = [
  {
    title: "At-a-Glance Overview",
    description:
      "Instantly view your total staked assets, accumulated yield, ROI, and available balances in a clear, consolidated format.",
    mockup: <MockupOverview />,
    icon: EyeIcon,
  },
  {
    title: "Effortless Staking",
    description:
      "Easily stake your USDC with flexible lock periods. Our intuitive interface makes managing your investments simple and secure.",
    mockup: <MockupStakingForm />,
    icon: ZapIcon,
  },
  {
    title: "Track Your Growth",
    description:
      "Monitor your deposit history, balance growth over time with interactive charts, and review recent transactions seamlessly.",
    mockup: <MockupAnalytics />,
    icon: BarChart2Icon,
  },
]

export function DashboardShowcase() {
  return (
    <section className="py-16 md:py-24 bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
            Experience the SoulPeg Dashboard
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
            Our dashboard provides a powerful yet user-friendly interface to manage your sUSDC staking, track earnings,
            and view detailed analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-neutral-800/40 border-neutral-700/60 shadow-xl flex flex-col h-full overflow-hidden hover:border-blue-500/40 transition-all"
            >
              <div className="p-6">
                <feature.icon className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400 mb-6 flex-grow">{feature.description}</p>
              </div>
              <div className="mt-auto px-6 pb-6">{feature.mockup}</div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 px-8 py-3"
            asChild
          >
            <Link href="/dashboard">
              Explore Dashboard Features
              <ArrowRightIcon className="ml-2.5 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
