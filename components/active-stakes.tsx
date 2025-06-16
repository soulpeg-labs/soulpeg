import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Unlock, ArrowRightLeft, Clock, HelpCircle, Info } from "lucide-react"
import { useAccount } from "wagmi"
import { format } from "date-fns"
import { useActiveStakes, type StakeData } from "../hooks/useActiveStakes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Active stakes list with "Add" button for topping-up a not-yet-unlocked stake.
 *
 * Props:
 *  • onAdd(id) — called when user clicks "Add" on a stake.
 *  • onUnlock(stake) — called when user clicks "Unlock" on a stake.
 *  • hasUnlocked — whether the user has called unlock() globally
 *  • hasActiveStakes — whether there are any stakes still locked by time
 */
export function ActiveStakes({ 
  onAdd,
  onUnlock,
  hasUnlocked = false,
  hasActiveStakes = false
}: { 
  onAdd: (id: string) => void
  onUnlock: (stake: StakeData) => void
  hasUnlocked?: boolean
  hasActiveStakes?: boolean
}) {
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

  return (
    <TooltipProvider>
      <Card className="rounded-3xl border p-6 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg">Active Stakes</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading…</div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">Failed to load stakes</p>
              <p className="text-xs text-gray-500 mt-2">
                {error?.message || "Unknown error"}
              </p>
            </div>
          ) : stakes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't opened any stakes yet</p>
              <p className="text-sm mt-1">Stake USDC to start earning yield.</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                    className="border rounded-xl p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Amount Staked
                        </p>
                        <p className="font-medium">{toUSD(s.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Unlock Date</p>
                        <p className="font-medium">
                          {format(s.unlockTime * 1000, "dd MMM yyyy")}
                        </p>
                        {status === 'ready' && !hasActiveStakes && (
                          <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Ready to unlock
                          </Badge>
                        )}
                        {status === 'ready' && hasActiveStakes && (
                          <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                        {status === 'unlocked' && (
                          <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                            <ArrowRightLeft className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Earned Yield</p>
                        <p className="font-medium text-green-600">
                          {toUSD(s.earned)}
                        </p>
                      </div>
                    </div>

                    {status === 'locked' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap mt-2 sm:mt-0"
                        onClick={() => onAdd(s.id)}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    )}
                    
                    {status === 'ready' && hasActiveStakes && (
                      <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          disabled
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p>This position has expired but cannot be modified while other positions are still locked.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                    
                    {status === 'ready' && !hasActiveStakes && (
                      <Button
                        variant="default"
                        size="sm"
                        className="whitespace-nowrap mt-2 sm:mt-0"
                        onClick={() => onUnlock(s)}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock
                      </Button>
                    )}
                    
                    {status === 'unlocked' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="whitespace-nowrap mt-2 sm:mt-0"
                        onClick={() => window.open("https://pancakeswap.finance/swap", "_blank")}
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Swap
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
