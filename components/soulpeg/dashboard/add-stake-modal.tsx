"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"
import { createClient } from "@supabase/supabase-js"
// initialise supabase with env vars _once_
// (frontend already loads those for the normal stake‑flow)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"

interface AddStakeModalProps {
  isOpen: boolean
  onClose: () => void
  stakeId: string
  currentAmount: string
  unlockDate: number
  earned: string
  onConfirm: (stakeId: string, amount: string) => void
}

export function AddStakeModal({
  isOpen,
  onClose,
  stakeId,
  currentAmount,
  unlockDate,
  earned,
  onConfirm,
}: AddStakeModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const { address } = useAccount()

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (!address) {
      toast.error("Connect your wallet first")
      return
    }

    setIsProcessing(true)
    try {
      // calculate remaining lock period (in days) for the back‑end worker
      const nowSec = Math.floor(Date.now() / 1_000)
      const remainingDays = Math.max(
        1,
        Math.round((unlockDate - nowSec) / 86_400),
      )

      const { error } = await supabase.from("stake_requests").insert([
        {
          wallet: address,
          amount_wei: parseUnits(amount, 18).toString(),
          lock_days: remainingDays,
          stake_id: stakeId, // let the worker know it's a top‑up
        },
      ])

      if (error) throw error

      toast.success(
        `Queued request to add ${amount} USDC – it will reflect once mined.`,
      )
      setAmount("")
      onClose()
    } catch (error: any) {
      console.error("add‑funds enqueue error:", error)
      toast.error("Failed to enqueue your add‑funds request")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add to Existing Stake</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add more USDC to your existing stake position
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3 text-sm bg-neutral-800/40 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-neutral-400">Current amount:</span>
              <span className="font-medium text-white">${currentAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Lock expires:</span>
              <span className="font-medium text-white">{format(unlockDate * 1000, "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Current earnings:</span>
              <span className="font-medium text-green-400">${earned}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="add-amount" className="text-neutral-200">Amount to add (USDC)</Label>
            <Input
              id="add-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 [&:focus]:border-blue-500 [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0"
            />
            {amount && (
              <p className="text-sm text-neutral-400">
                New total: <span className="text-white font-medium">${(parseFloat(currentAmount) + parseFloat(amount || "0")).toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!amount || isProcessing || !address}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? "Adding..." : "Add funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 