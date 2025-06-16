import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletIcon, RefreshCwIcon, CoinsIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface BalanceCardProps {
  susdcBalance: string
  usdcBalance: string
  isLoading?: boolean
  onRefresh?: () => void
}

export function BalanceCard({ susdcBalance, usdcBalance, isLoading = false, onRefresh }: BalanceCardProps) {
  return (
    <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
          <WalletIcon className="h-6 w-6 mr-3 text-blue-400" />
          Your Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-neutral-700/40 rounded-lg">
          <div>
            <p className="text-sm text-neutral-400">sUSDC Balance (Soul-bound)</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-neutral-700 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-neutral-50">{susdcBalance}</p>
            )}
          </div>
          <CoinsIcon className="h-8 w-8 text-purple-400" />
        </div>
        <div className="flex justify-between items-center p-4 bg-neutral-700/40 rounded-lg">
          <div>
            <p className="text-sm text-neutral-400">USDC Balance (Available for Staking)</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-neutral-700 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-neutral-50">{usdcBalance}</p>
            )}
          </div>
          <CoinsIcon className="h-8 w-8 text-green-400" />
        </div>
        <Button
          variant="outline"
          className="w-full border-neutral-700 bg-transparent text-blue-400 hover:bg-neutral-800 hover:text-blue-300 hover:border-neutral-600"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Balances
        </Button>
      </CardContent>
    </Card>
  )
}
