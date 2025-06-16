"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TimerIcon, LockIcon, UnlockIcon, Clock, Banknote } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LockStatusCardProps {
  dataReady?: boolean
  globalStatus?: "none" | "locked" | "ready" | "unlocked"
  secondsRemaining: number
  isLocked: boolean
  hasDeposits: boolean
  hasUnlocked: boolean
  hasActiveStakes: boolean
  onUnlock?: () => void
  isUnlocking?: boolean
  isUnlockLoading?: boolean
}

export function LockStatusCard({ 
  dataReady = true,
  globalStatus,
  secondsRemaining, 
  isLocked, 
  hasDeposits,
  hasUnlocked,
  hasActiveStakes,
  onUnlock,
  isUnlocking = false,
  isUnlockLoading = false
}: LockStatusCardProps) {
  const [timeLeft, setTimeLeft] = useState(secondsRemaining)

  useEffect(() => {
    setTimeLeft(secondsRemaining)
  }, [secondsRemaining])

  useEffect(() => {
    if (isLocked && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isLocked, timeLeft])

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  // Show skeleton while loading
  if (!dataReady) {
    return (
      <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
            <TimerIcon className="h-6 w-6 mr-3 text-blue-400" />
            Lock Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Skeleton className="h-32 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  // Use globalStatus if provided, otherwise fall back to original logic
  let lockStatus: 'none' | 'locked' | 'ready' | 'unlocked'
  let statusText: string
  let statusColor: string
  let statusDescription: string

  if (globalStatus) {
    lockStatus = globalStatus
    
    switch (globalStatus) {
      case 'none':
        statusText = 'No deposits yet'
        statusColor = 'text-neutral-500'
        statusDescription = 'Connect wallet and start staking to earn yield'
        break
      case 'locked':
        statusText = formatTime(timeLeft)
        statusColor = 'text-neutral-50'
        statusDescription = 'Wait for timer to expire. No actions available while positions are locked.'
        break
      case 'ready':
        statusText = 'Ready to unlock'
        statusColor = 'text-orange-400'
        statusDescription = 'Timer expired - ready to unlock all'
        break
      case 'unlocked':
        statusText = 'Unlocked'
        statusColor = 'text-green-400'
        statusDescription = 'All positions unlocked'
        break
    }
  } else {
    // Fallback to original logic
    if (!hasDeposits) {
      lockStatus = 'none'
      statusText = 'No active lock'
      statusColor = 'text-neutral-500'
      statusDescription = 'Start staking to earn yield'
    } else if (hasUnlocked) {
      lockStatus = 'unlocked'
      statusText = 'Unlocked'
      statusColor = 'text-green-400'
      statusDescription = 'All positions unlocked'
    } else if (timeLeft > 0) {
      lockStatus = 'locked'
      statusText = formatTime(timeLeft)
      statusColor = 'text-neutral-50'
      statusDescription = 'Wait for timer to expire. No actions available while positions are locked.'
    } else if (hasActiveStakes) {
      lockStatus = 'ready'
      statusText = 'Ready to unlock'
      statusColor = 'text-orange-400'
      statusDescription = 'Timer expired - ready to unlock all'
    } else {
      lockStatus = 'none'
      statusText = 'No active lock'
      statusColor = 'text-neutral-500'
      statusDescription = 'Start staking to earn yield'
    }
  }

  return (
    <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
          <TimerIcon className="h-6 w-6 mr-3 text-blue-400" />
          Lock Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {lockStatus === 'none' ? (
          <div className="rounded-full bg-neutral-700/50 p-3 w-fit mx-auto">
            <Clock className="h-12 w-12 text-neutral-500" />
          </div>
        ) : lockStatus === 'unlocked' ? (
          <UnlockIcon className="h-12 w-12 text-green-400 mx-auto" />
        ) : lockStatus === 'ready' ? (
          <div className="rounded-full bg-orange-500/20 p-3 w-fit mx-auto">
            <Clock className="h-12 w-12 text-orange-400" />
          </div>
        ) : (
          <LockIcon className="h-14 w-14 text-orange-400 mx-auto" />
        )}
        
        <p className="text-sm text-neutral-400">
          {lockStatus === 'none' ? 'No Active Lock' : 'Global Timer for all positions'}
        </p>
        
        <div className="space-y-2">
          <p className={`text-3xl font-bold ${statusColor}`}>{statusText}</p>
          {lockStatus === 'locked' && (
            <p className="text-sm font-semibold text-orange-400">Positions Locked</p>
          )}
          {lockStatus === 'ready' && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
              <Clock className="h-3 w-3 mr-1" /> Ready
            </Badge>
          )}
          {lockStatus === 'unlocked' && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <UnlockIcon className="h-3 w-3 mr-1" /> Unlocked
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-neutral-500 pt-2">
          {statusDescription}
        </p>
      </CardContent>
      <CardFooter>


        {lockStatus === 'ready' && (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            variant="default"
            size="lg"
            onClick={onUnlock}
            disabled={isUnlocking || isUnlockLoading}
          >
            {isUnlocking || isUnlockLoading ? (
              "Unlocking all positions..."
            ) : (
              <>
                <UnlockIcon className="h-4 w-4 mr-2" /> Unlock All Positions
              </>
            )}
          </Button>
        )}

        {lockStatus === 'unlocked' && (
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            onClick={() => window.open("https://pancakeswap.finance/swap", "_blank")}
          >
            <Banknote className="h-4 w-4 mr-2" /> Swap on PancakeSwap
          </Button>
        )}

        {lockStatus === 'none' && (
          <div className="w-full text-center">
            <p className="text-sm text-neutral-500">Stake USDC to start earning</p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
