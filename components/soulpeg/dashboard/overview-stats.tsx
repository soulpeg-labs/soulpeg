import { DollarSignIcon, TrendingUpIcon, PercentIcon } from "lucide-react"

interface OverviewStatsProps {
  totalStaked: string
  accumulatedYield: string
  roi: string
}

export function OverviewStats({ totalStaked, accumulatedYield, roi }: OverviewStatsProps) {
  const stats = [
    { label: "Total sUSDC Staked", value: totalStaked, icon: DollarSignIcon, unit: "sUSDC" },
    { label: "Accumulated Yield", value: accumulatedYield, icon: TrendingUpIcon, unit: "sUSDC" },
    { label: "Current ROI", value: roi, icon: PercentIcon, unit: "" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <stat.icon className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-semibold text-neutral-50">
            {stat.value}
            {stat.unit && <span className="text-lg ml-1 text-neutral-400">{stat.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
