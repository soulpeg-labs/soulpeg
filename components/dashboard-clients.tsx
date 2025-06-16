"use client"

import { useState, useEffect } from "react"
import {
  Card,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Unlock, ArrowRightLeft } from "lucide-react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { SUSDC, USDC, SUSDC_ABI, USDC_ABI } from "@/lib/constants"
import { useTokenBalances } from "@/hooks/useTokenBalances"
import { mutate } from "swr"
import { SystemStatusBanner } from "@/components/soulpeg/dashboard/system-status-banner"
import { BalanceChart } from "@/components/soulpeg/dashboard/balance-chart"
import { RecentTransactions } from "@/components/soulpeg/dashboard/recent-transactions"
import { ActiveStakesCard } from "@/components/soulpeg/dashboard/active-stakes-card"

import { StakeData, useActiveStakes } from "@/hooks/useActiveStakes"
import { useRealtimeWallet } from "@/hooks/useRealtimeWallet"
import { AddStakeModal } from "./soulpeg/dashboard/add-stake-modal"
import { supabase } from "@/lib/supabase"
import { BalanceCard } from "@/components/soulpeg/dashboard/balance-card"
import { LockStatusCard } from "@/components/soulpeg/dashboard/lock-status-card"
import { OverviewStats } from "@/components/soulpeg/dashboard/overview-stats"
import { StakeForm } from "@/components/soulpeg/dashboard/stake-form"
import { Separator } from "@/components/ui/separator"

export default function DashboardClient() {
  console.log("🔴 UserDashboard RENDER START")

  const { address } = useAccount()
  // Supabase realtime subscription: refresh stakes and tx on DB changes
  useRealtimeWallet(address)

  const { susdc, usdc, isReady } = useTokenBalances()

  // Get active stakes data
  const {
    data: activeStakes = [],
    isLoading,
  } = useActiveStakes(address)

  // State for staking form
  const [amount, setAmount] = useState("")
  const [lockDays, setLockDays] = useState("7")
  const [isApproving, setIsApproving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)

  // State for adding to existing stake
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedStakeData, setSelectedStakeData] = useState<StakeData | null>(null)

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC,
    abi: USDC_ABI,
    functionName: "allowance",
    args: [address, SUSDC],
    query: { enabled: !!address },
  })
  // Cast allowance to bigint | undefined for type‑safe arithmetic
  const allowanceBn = allowance as bigint | undefined

  // Read remaining lock time
  const { data: remainingLockTime, refetch: refetchLockTime } = useReadContract({
    address: SUSDC,
    abi: SUSDC_ABI,
    functionName: "getRemainingLockTime",
    args: [address],
    query: { enabled: !!address },
  })

  // Read daily limit status
  const { data: dailyLimitStatus, refetch: refetchDailyLimit } = useReadContract({
    address: SUSDC,
    abi: SUSDC_ABI,
    functionName: "getDailyLimitStatus",
    query: { enabled: !!address },
  })

  // Read unlock status
  const { data: isUnlocked, refetch: refetchIsUnlocked } = useReadContract({
    address: SUSDC,
    abi: SUSDC_ABI,
    functionName: "isUnlocked",
    args: [address],
    query: { enabled: !!address },
  })

  // Read unlock timestamp
  const { data: unlockAtTimestamp } = useReadContract({
    address: SUSDC,
    abi: SUSDC_ABI,
    functionName: "unlockAt",
    args: [address],
    query: { enabled: !!address },
  })

  // --- readiness flags -------------------------------------------------
  const stakesReady = !isLoading

  // We only need on‑chain lock info if there is at least one stake.
  const hasAnyStakes = activeStakes.length > 0

  const lockInfoReady =
    !hasAnyStakes || remainingLockTime !== undefined

  // If no address, consider data ready to show empty state
  const dataReady = !address ? true : (stakesReady && lockInfoReady)

  // Debug logging for dataReady
  console.log("🔍 DataReady Debug:", {
    stakesReady,
    isLoading,
    lockInfoReady,
    remainingLockTime,
    isUnlocked,
    dataReady,
    address
  })

  // Calculate totals for MyStakeCard - only include locked stakes
  const now = Date.now() / 1000

  // Determine the actual unlock status
  const unlockAt = unlockAtTimestamp ? Number(unlockAtTimestamp) : 0
  // unlockAt == 1 действительно указывает, что unlock() вызывали,
  // но считаем статус «unlocked» только если уже есть хотя бы один stake
  const hasUnlocked = activeStakes.length > 0 && unlockAt === 1

  // все стейки уже «дозрели» по времени?
  const allTimesElapsed = 
    activeStakes.length > 0 &&
    activeStakes.every((s) => s.unlockTime <= now)

  /**
   * Глобально разблокировано - только если
   *  1) контракт говорит «unlocked»  **И**
   *  2) ни у одного стейка не осталось блокировки по времени
   */
  const hasUnlockedGlobal = Boolean(isUnlocked) && allTimesElapsed

  // Check if there are any stakes still locked by time
  const hasActiveStakes = activeStakes.some(
    stake => stake.unlockTime > now
  )

  // Filter stakes based on actual unlock status
  const actuallyLockedStakes = activeStakes.filter(
    (s) => !hasUnlockedGlobal && s.unlockTime > now
  )

  const readyToUnlockStakes = activeStakes.filter(
    (s) => !hasUnlockedGlobal && s.unlockTime <= now
  )

  const actuallyUnlockedStakes = hasUnlockedGlobal ? activeStakes : []

  // Add global status calculation
  const globalStatus: "none" | "locked" | "ready" | "unlocked" =
    !address // No wallet connected
      ? "none"
      : activeStakes.length === 0
        ? "none"
        : hasUnlockedGlobal
          ? "unlocked"
          : readyToUnlockStakes.length > 0
            ? "ready"
            : "locked"

  const totalStaked = actuallyLockedStakes.reduce((sum, stake) => sum + parseFloat(stake.amount), 0)
  const accumulatedYield = actuallyLockedStakes.reduce((sum, stake) => sum + parseFloat(stake.earned), 0)

  // Calculate actual return percentage
  const returnPercentage = totalStaked > 0 ? (accumulatedYield / totalStaked) * 100 : 0

  // Calculate unlocked funds separately - only if actually unlocked
  const unlockedAmount = actuallyUnlockedStakes.reduce((sum, stake) => sum + parseFloat(stake.amount), 0)
  const unlockedYield = actuallyUnlockedStakes.reduce((sum, stake) => sum + parseFloat(stake.earned), 0)

  // Write contracts
  const { writeContract: writeUSDC, data: approveHash } = useWriteContract()
  const { writeContract: writeUnlock, data: unlockHash } = useWriteContract()

  // Wait for transaction receipts
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash })

  const { isLoading: isUnlockLoading, isSuccess: isUnlockSuccess } =
    useWaitForTransactionReceipt({ hash: unlockHash })

  const needsApproval =
    allowanceBn === undefined ||
    (amount ? parseUnits(amount, 18) > allowanceBn : false)

  // Debug logging
  console.log("🔍 Allowance Debug:", {
    allowance: allowance?.toString(),
    allowanceFormatted: allowance ? formatUnits(allowance as bigint, 18) : "0",
    amount,
    amountParsed: amount ? parseUnits(amount, 18).toString() : "0",
    needsApproval,
    address,
    SUSDC
  })

  // Format remaining lock time
  const formattedLockTime = remainingLockTime ? Number(remainingLockTime) : 0

  // Daily limit info
  const dailyLimitArray = dailyLimitStatus as [bigint, bigint] | undefined
  // --- daily‑limit helpers ---
  const usedTodayBn = dailyLimitArray?.[0] ?? BigInt(0)
  const maxPerDayBn = dailyLimitArray?.[1] ?? BigInt(0)

  const exceedsDailyLimit =
    amount !== "" &&
    maxPerDayBn !== BigInt(0) &&
    parseUnits(amount, 18) + usedTodayBn > maxPerDayBn

  const currentLimit = formatUnits(usedTodayBn, 18)
  const maxLimit = maxPerDayBn === BigInt(0) ? "∞" : formatUnits(maxPerDayBn, 18)
  const limitPercentage =
    maxPerDayBn === BigInt(0)
      ? "—"
      : ((Number(usedTodayBn) / Number(maxPerDayBn)) * 100).toFixed(0)

  // Handle approve
  const handleApprove = async () => {
    if (!address || !amount) return
    try {
      setIsApproving(true)
      writeUSDC({
        address: USDC,
        abi: USDC_ABI,
        functionName: "approve",
        args: [SUSDC, parseUnits(amount, 18)],
      })
    } catch (error: any) {
      console.error("Approval error:", error)
      const isUserReject = error?.cause?.code === 4001
      toast.error(isUserReject ? "Approval Cancelled" : "Approval Failed", {
        description: isUserReject
          ? "You rejected the approval transaction."
          : "There was an error approving your USDC.",
      })
      setIsApproving(false)
    }
  }

  // Handle stake – enqueue for the relayer
  const handleStake = async () => {
    if (!address || !amount || !lockDays) return

    try {
      setIsSubmitting(true)

      // enqueue request for the relayer (supabase 'stake_requests' table)
      const { error } = await supabase.from("stake_requests").insert([
        {
          wallet: address,
          amount_wei: parseUnits(amount, 18).toString(),
          lock_days: Number(lockDays),
        },
      ])

      if (error) throw error

      toast.success("Stake request submitted", {
        description:
          "Your request is queued – the protocol will mint sUSDC once it's processed.",
      })

      // UI clean‑up
      setAmount("")
      refetchDailyLimit()
    } catch (error: any) {
      console.error("Stake‑enqueue error:", error)
      toast.error("Failed to submit", {
        description:
          error.message ?? "Could not enqueue your stake request.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle unlock
  const handleUnlock = async () => {
    if (!address) return
    try {
      setIsUnlocking(true)
      writeUnlock({
        address: SUSDC,
        abi: SUSDC_ABI,
        functionName: "unlock",
      })
    } catch (error: any) {
      console.error("Unlock error:", error)
      const isUserReject = error?.cause?.code === 4001
      toast.error(isUserReject ? "Unlock Cancelled" : "Unlock Failed", {
        description: isUserReject
          ? "You rejected the unlock transaction."
          : "There was an error unlocking your sUSDC.",
      })
      setIsUnlocking(false)
    }
  }

  // Handle unlock for a specific stake
  const handleUnlockStake = async (stake: StakeData) => {
    if (!address) return
    try {
      setIsUnlocking(true)

      // Send tx; waiters will pick up the hash via hook
      writeUnlock({
        address: SUSDC,
        abi: SUSDC_ABI,
        functionName: "unlock",
      })
    } catch (error) {
      console.error("Unlock error:", error)
      toast.error("Unlock Failed", {
        description: "There was an error unlocking your stake.",
      })
      setIsUnlocking(false)
    }
  }

  // Handle adding to existing stake
  const handleAddToStake = (stakeId: string) => {
    const stake = activeStakes.find(s => s.id === stakeId)
    if (!stake) return

    setSelectedStakeData(stake)
    setIsAddModalOpen(true)
  }

  // Handle confirming add to stake
  const handleConfirmAdd = async (stakeId: string, amount: string) => {
    // TODO: Call increaseAmount(stakeId, amount) on contract
    console.log("TODO: Implement increaseAmount", stakeId, amount)

    // For now just close modal
    setIsAddModalOpen(false)
    setSelectedStakeData(null)

    // Refresh stakes
    mutate(["active-stakes", address])
  }

  // Refetch data after successful transactions
  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Approval Successful", {
        description: "Your USDC has been approved for staking.",
      })
      refetchAllowance()
      setIsApproving(false)
    }
  }, [isApproveSuccess, refetchAllowance])


  useEffect(() => {
    if (isUnlockSuccess) {
      toast.success("Unlock Successful", {
        description: "Your sUSDC has been unlocked and is now transferable.",
        action: {
          label: "Swap on PancakeSwap",
          onClick: () => window.open("https://pancakeswap.finance/swap", "_blank")
        }
      })
      refetchLockTime()
      setIsUnlocking(false)
      // Refresh active stakes to update their status
      mutate(["active-stakes", address])
    }
  }, [isUnlockSuccess, refetchLockTime, address])

  /**
   * После того как в Supabase появился первый stake
   * (или их количество изменилось), делаем быструю
   * перезагрузку данных из смарт-контракта.
   */
  useEffect(() => {
    if (address) {
      refetchLockTime()     // уже был в хуке
      refetchIsUnlocked()   // добавили
    }
  }, [activeStakes.length, address, refetchLockTime, refetchIsUnlocked])

  return (
    <>
      {/* Main content without navbar - it's now in the page wrapper */}
      <div className="space-y-8">
        {/* System Status Banner - moved before heading */}
        <SystemStatusBanner operational={true} />

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-50 tracking-tight">
          Your sUSDC Dashboard
        </h1>

        {/* Unlocked funds banner - show only when data is ready and funds are unlocked */}
        {dataReady && unlockedAmount > 0 && (
          <Card className="rounded-3xl border border-amber-700/50 p-6 shadow-sm bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-500/20 p-2">
                  <Unlock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-300">Unlocked Funds Available</h3>
                  <p className="text-sm text-amber-400/80">
                    You have ${(unlockedAmount + unlockedYield).toFixed(2)} unlocked sUSDC ready to swap
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => window.open("https://pancakeswap.finance/swap", "_blank")}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Swap on PancakeSwap
              </Button>
            </div>
          </Card>
        )}

        {/* Overview Stats */}
        <OverviewStats
          totalStaked={totalStaked.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          accumulatedYield={accumulatedYield.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          roi={`${returnPercentage.toFixed(2)}%`}
        />

        {/* Main grid: 3 columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BalanceCard
              susdcBalance={susdc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              usdcBalance={usdc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              isLoading={!isReady}
              onRefresh={() => {
                mutate(["bal-susdc", address])
                mutate(["bal-usdc", address])
              }}
            />
            <StakeForm
              amount={amount}
              setAmount={setAmount}
              lockDays={lockDays}
              setLockDays={setLockDays}
              hasLockedPositions={actuallyLockedStakes.length > 0}
              hasUnlockedPositions={actuallyUnlockedStakes.length > 0}
              activeLockDays={actuallyLockedStakes.length > 0
                ? Math.ceil((actuallyLockedStakes[0].unlockTime - now) / 86400)
                : 0}
              hasSufficientBalance={Number(amount) > 0 && Number(amount) <= usdc}
              exceedsDailyLimit={exceedsDailyLimit}
              needsApproval={needsApproval}
              isApproving={isApproving}
              isApproveLoading={isApproveLoading}
              isSubmitting={isSubmitting}
              allowance={allowanceBn !== undefined
                ? Number(formatUnits(allowanceBn, 18)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
                : undefined}
              currentLimit={currentLimit}
              maxLimit={maxLimit}
              limitPercentage={limitPercentage}
              estimatedSUSDC={amount ? Number.parseFloat(amount).toFixed(2) : "0.00"}
              unlockDate={lockDays
                ? new Date(Date.now() + Number.parseInt(lockDays, 10) * 86400000).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                })
                : ""}
              onApprove={handleApprove}
              onStake={handleStake}
            />
          </div>
          <div className="space-y-8">
            <LockStatusCard
              dataReady={dataReady}
              globalStatus={globalStatus}
              secondsRemaining={formattedLockTime}
              isLocked={formattedLockTime > 0 && !hasUnlockedGlobal}
              hasDeposits={activeStakes.length > 0}
              hasUnlocked={hasUnlockedGlobal}
              hasActiveStakes={hasActiveStakes}
              onUnlock={handleUnlock}
              isUnlocking={isUnlocking}
              isUnlockLoading={isUnlockLoading}
            />
            <ActiveStakesCard
              onAdd={handleAddToStake}
              onUnlock={handleUnlockStake}
              hasUnlocked={hasUnlockedGlobal}
              hasActiveStakes={hasActiveStakes}
            />
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 md:my-12 bg-neutral-700/60" />

        {/* Bottom grid: 5 columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <RecentTransactions />
          </div>
          <div className="lg:col-span-2">
            <BalanceChart />
          </div>
        </div>

        {/* Add Stake Modal */}
        {selectedStakeData && (
          <AddStakeModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false)
              setSelectedStakeData(null)
            }}
            stakeId={selectedStakeData.id}
            currentAmount={selectedStakeData.amount}
            unlockDate={selectedStakeData.unlockTime}
            earned={selectedStakeData.earned}
            onConfirm={handleConfirmAdd}
          />
        )}
      </div>
    </>
  )
}
