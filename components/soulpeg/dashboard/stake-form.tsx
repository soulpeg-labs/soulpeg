"use client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, InfoIcon, ZapIcon, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StakeFormProps {
  amount: string
  setAmount: (value: string) => void
  lockDays: string
  setLockDays: (value: string) => void
  hasLockedPositions: boolean
  hasUnlockedPositions: boolean
  activeLockDays: number
  hasSufficientBalance: boolean
  exceedsDailyLimit: boolean
  needsApproval: boolean
  isApproving: boolean
  isApproveLoading: boolean
  isSubmitting: boolean
  allowance?: string
  currentLimit: string
  maxLimit: string
  limitPercentage: string
  estimatedSUSDC: string
  unlockDate: string
  onApprove: () => void
  onStake: () => void
}

const lockPeriods = [
  { id: "7", label: "7 days", yield: "5%" },
  { id: "30", label: "30 days", yield: "7%" },
  { id: "90", label: "90 days", yield: "10%" },
]

export function StakeForm({
  amount,
  setAmount,
  lockDays,
  setLockDays,
  hasLockedPositions,
  hasUnlockedPositions,
  activeLockDays,
  hasSufficientBalance,
  exceedsDailyLimit,
  needsApproval,
  isApproving,
  isApproveLoading,
  isSubmitting,
  allowance,
  currentLimit,
  maxLimit,
  limitPercentage,
  estimatedSUSDC,
  unlockDate,
  onApprove,
  onStake,
}: StakeFormProps) {
  return (
    <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
          <ZapIcon className="h-6 w-6 mr-3 text-blue-400" />
          Stake USDC
        </CardTitle>
        <p className="text-sm text-neutral-400 mt-1">
          {hasLockedPositions
            ? "You already have an active stake"
            : hasUnlockedPositions
              ? "Your previous positions are unlocked"
              : "Stake your USDC to receive sUSDC"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasLockedPositions && (
          <Alert variant="default" className="bg-amber-500/10 border-amber-500/30">
            <AlertCircleIcon className="h-5 w-5" style={{ color: 'white' }} />
            <AlertDescription className="text-amber-300">
              You already have an active {activeLockDays}-day lock. Add funds or wait until it expires.
            </AlertDescription>
          </Alert>
        )}

        {hasUnlockedPositions && !hasLockedPositions && (
          <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-300">
            <AlertCircleIcon className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-300">
              Unlocked funds available - swap them on PancakeSwap before creating a new stake.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="amount" className="text-sm font-medium text-neutral-300 mb-1.5 block">
            Amount (USDC)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount to stake"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-neutral-700/50 border-neutral-600 text-neutral-100 [&:focus]:border-blue-500 [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 h-12 text-base placeholder:text-neutral-500"
          />
          {amount && lockDays && (
            <p className="text-sm text-neutral-400 pt-2">
              You will receive ≈ {estimatedSUSDC} sUSDC • Unlocks {unlockDate}
            </p>
          )}
          <div className="text-xs text-neutral-400 mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Daily Limit: {currentLimit}/{maxLimit} ({limitPercentage}%)</span>
              {allowance && <span>Current Allowance: {allowance} USDC</span>}
            </div>
            {!hasSufficientBalance && amount && (
              <p className="text-red-400">Entered amount exceeds available USDC balance.</p>
            )}
            {exceedsDailyLimit && (
              <p className="text-red-400">Entered amount exceeds today's remaining limit.</p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-neutral-300 mb-2 block">Lock Period</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lockPeriods.map((period) => (
              <Button
                key={period.id}
                variant="outline"
                onClick={() => setLockDays(period.id)}
                className={cn(
                  "h-auto py-3 px-4 flex flex-col items-center justify-center space-y-1 transition-all duration-200",
                  lockDays === period.id
                    ? "bg-blue-500/10 border-blue-500 text-white shadow-md hover:bg-neutral-800/80 hover:text-white"
                    : "bg-neutral-700/50 border-neutral-600 text-neutral-300 hover:bg-neutral-600/50 hover:border-neutral-500 hover:text-white",
                )}
              >
                <span className="text-base font-semibold">{period.label}</span>
                <span className="text-xs text-green-400">{period.yield} Yield</span>
              </Button>
            ))}
          </div>
        </div>

        {hasLockedPositions && (
          <Alert variant="default" className="bg-neutral-700/30 border-neutral-600/50 text-neutral-400">
            <AlertDescription>⚠️  Multiple locks coming in future versions.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {needsApproval ? (
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-md hover:shadow-blue-500/50 transition-all"
            onClick={onApprove}
            disabled={!amount || isApproving || isApproveLoading || hasLockedPositions}
          >
            {isApproving || isApproveLoading ? "Approving..." : "Step 1: Approve USDC"}
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-md hover:shadow-blue-500/50 transition-all disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed"
                    onClick={onStake}
                    disabled={
                      !amount ||
                      !lockDays ||
                      !hasSufficientBalance ||
                      exceedsDailyLimit ||
                      isSubmitting ||
                      hasLockedPositions ||
                      needsApproval
                    }
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : exceedsDailyLimit ? (
                      "Daily limit exceeded"
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2 inline" />
                        {hasLockedPositions ? "Stake USDC (Disabled)" : "Step 2: Submit stake request"}
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {hasLockedPositions && (
                <TooltipContent>
                  <p>You already have an active lock. Add funds or wait until it expires.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  )
}
