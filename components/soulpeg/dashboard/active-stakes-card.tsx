import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayersIcon, CalendarDaysIcon, GiftIcon, PlusCircleIcon, Unlock, ArrowRightLeft, Clock, Info, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { format } from "date-fns"
import { useActiveStakes, type StakeData } from "@/hooks/useActiveStakes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActiveStakesCardProps {
  onAdd: (id: string) => void
  onUnlock: (stake: StakeData) => void
  hasUnlocked?: boolean
  hasActiveStakes?: boolean
}

export function ActiveStakesCard({ 
  onAdd,
  onUnlock,
  hasUnlocked = false,
  hasActiveStakes = false
}: ActiveStakesCardProps) {
  const { address } = useAccount()

  const {
    data: stakes = [],
    isLoading,
    error,
  } = useActiveStakes(address)

  const toUSD = (amount: string) => {
    const value = parseFloat(amount)
    
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Calculate totals
  const totalStaked = stakes.reduce((sum, stake) => sum + parseFloat(stake.amount), 0)
  const totalEarned = stakes.reduce((sum, stake) => sum + parseFloat(stake.earned), 0)
  const nextUnlockDate = stakes.length > 0 
    ? format(Math.min(...stakes.map(s => s.unlockTime)) * 1000, "dd MMM yyyy")
    : "No active stakes"

  return (
    <TooltipProvider>
      <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
            <LayersIcon className="h-6 w-6 mr-3 text-blue-400" />
            Active Stakes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center text-neutral-500">Loading…</div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-400">Failed to load stakes</p>
              <p className="text-xs text-neutral-500 mt-2">
                {error?.message || "Unknown error"}
              </p>
            </div>
          ) : stakes.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p>You haven't opened any stakes yet</p>
              <p className="text-sm mt-1">Stake USDC to start earning yield.</p>
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400 flex items-center">
                    <LayersIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    Amount Staked
                  </span>
                  <span className="font-semibold text-neutral-100">{toUSD(totalStaked.toString())} sUSDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400 flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    Unlock Date
                  </span>
                  <span className="font-semibold text-neutral-100">{nextUnlockDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400 flex items-center">
                    <GiftIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    Earned Yield
                  </span>
                  <span className="font-semibold text-green-400">{toUSD(totalEarned.toString())} sUSDC</span>
                </div>
              </div>

              {/* Individual stakes */}
              <div className="space-y-3 pt-2">
                {stakes.map((s: StakeData) => {
                  const now = Date.now() / 1_000
                  const timeExpired = now >= s.unlockTime
                  
                  // Three states:
                  // 1. locked: time not expired
                  // 2. ready: time expired but unlock() not called (or blocked by other active stakes)
                  // 3. unlocked: unlock() was called
                  const status = hasUnlocked ? 'unlocked' : (timeExpired ? 'ready' : 'locked')
                  
                  return (
                    <div
                      key={s.id}
                      className="border border-neutral-700/50 rounded-xl p-3 bg-neutral-900/50 hover:bg-neutral-900/70 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-neutral-200">{toUSD(s.amount)}</p>
                            <p className="text-xs text-neutral-500">Unlocks {format(s.unlockTime * 1000, "dd MMM yyyy")}</p>
                          </div>
                          {status === 'ready' && !hasActiveStakes && (
                            <Badge variant="secondary" className="mt-1 bg-orange-500/20 text-orange-400 border-orange-500/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Ready to unlock
                            </Badge>
                          )}
                          {status === 'ready' && hasActiveStakes && (
                            <Badge variant="secondary" className="mt-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Expired
                            </Badge>
                          )}
                          {status === 'unlocked' && (
                            <Badge variant="secondary" className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
                              <ArrowRightLeft className="w-3 h-3 mr-1" />
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {status === 'ready' && hasActiveStakes && (
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-neutral-600 text-neutral-400"
                                disabled
                              >
                                <PlusCircleIcon className="w-4 h-4" />
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-neutral-500 cursor-help hover:text-neutral-400" />
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs bg-neutral-800 border-neutral-700 text-neutral-200">
                                  <p>This position has expired but cannot be modified while other positions are still locked.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                          
                          {status === 'ready' && !hasActiveStakes && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-500 text-white"
                              onClick={() => onUnlock(s)}
                            >
                              <Unlock className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {status === 'unlocked' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-neutral-700 hover:bg-neutral-600 text-neutral-300"
                              onClick={() => window.open("https://pancakeswap.finance/swap", "_blank")}
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add to Stake button - full width at bottom */}
              {stakes.some(s => {
                const now = Date.now() / 1_000
                return now < s.unlockTime && !hasUnlocked
              }) && (
                <Button
                  variant="outline"
                  className="w-full mt-4 border-green-500/50 bg-transparent text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/70"
                  onClick={() => {
                    // Find first locked stake
                    const firstLocked = stakes.find(s => {
                      const now = Date.now() / 1_000
                      return now < s.unlockTime && !hasUnlocked
                    })
                    if (firstLocked) onAdd(firstLocked.id)
                  }}
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Add to Stake
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
