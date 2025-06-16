"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, CheckCircle2Icon, ExternalLinkIcon, HistoryIcon, Copy, CheckCircle, XCircle, Loader2, Gift, Circle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTransactions } from "@/hooks/useTransactions"
import { useAccount } from "wagmi"
import { Skeleton } from "@/components/ui/skeleton"

const TRANSACTIONS_LIMIT = 20
const VISIBLE_HEIGHT = "24rem"

// --- helpers for UI decorations -------------------------------------------

const getTypeIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return <ArrowDownCircleIcon className="h-4 w-4 text-green-400" />
    case "reward":
      return <Gift className="h-4 w-4 text-blue-400" />
    case "withdraw":
      return <ArrowUpCircleIcon className="h-4 w-4 text-red-400" />
    default:
      return <Circle className="h-4 w-4 text-neutral-500" />
  }
}

const getStatusContent = (status: string | undefined) => {
  switch (status) {
    case "pending":
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
          <span className="ml-1.5 capitalize">Pending</span>
        </>
      )
    case "failed":
      return (
        <>
          <XCircle className="h-4 w-4 text-red-400" />
          <span className="ml-1.5 capitalize">Failed</span>
        </>
      )
    default: // "confirmed" or undefined
      return (
        <>
          <CheckCircle2Icon className="h-4 w-4 text-green-400" />
          <span className="ml-1.5 capitalize">Confirmed</span>
        </>
      )
  }
}

export function RecentTransactions() {
  const { address } = useAccount()
  
  // В dashboard кошелек уже подключен, но добавим fallback для безопасности
  const { transactions, isInitialLoading, isRefreshing } = useTransactions(
    address || "",
    { limit: TRANSACTIONS_LIMIT }
  )
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 1500)
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const fmtAmount = (amount: string) => {
    // Конвертируем из wei (18 знаков) в обычные единицы
    const value = Number(amount) / 1e18
    const absValue = Math.abs(value)
    const formatted = absValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })
    return value < 0 ? `-$${formatted}` : `$${formatted}`
  }

  return (
    <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
          <HistoryIcon className="h-6 w-6 mr-3 text-blue-400" />
          Recent Transactions
          {isRefreshing && <Loader2 className="h-4 w-4 ml-2 animate-spin text-neutral-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isInitialLoading ? (
          <div className="overflow-hidden" style={{ maxHeight: VISIBLE_HEIGHT }}>
            <Table className="text-neutral-300">
              <TableHeader>
                <TableRow className="border-neutral-700 hover:bg-neutral-700/30">
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Type</TableHead>
                  <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400 text-right">Tx ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-neutral-700/70">
                    <TableCell className="py-3"><Skeleton className="h-4 w-20 bg-neutral-700" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-4 w-16 bg-neutral-700" /></TableCell>
                    <TableCell className="py-3 text-right"><Skeleton className="h-4 w-24 bg-neutral-700 ml-auto" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-4 w-24 bg-neutral-700" /></TableCell>
                    <TableCell className="py-3 text-right"><Skeleton className="h-4 w-28 bg-neutral-700 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700/50 flex items-center justify-center">
              <HistoryIcon className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-200 mb-1">No transactions yet</h3>
            <p className="text-xs text-neutral-500">Your deposit transactions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div 
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800" 
              style={{ maxHeight: VISIBLE_HEIGHT }}
            >
              <Table className="text-neutral-300">
                <TableHeader className="sticky top-0 bg-neutral-800/95 z-10">
                  <TableRow className="border-neutral-700 hover:bg-neutral-700/30">
                    <TableHead className="text-neutral-400">Date</TableHead>
                    <TableHead className="text-neutral-400">Type</TableHead>
                    <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                    <TableHead className="text-neutral-400">Status</TableHead>
                    <TableHead className="text-neutral-400 text-right">Tx ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-neutral-700/70 hover:bg-neutral-700/40">
                      <TableCell className="py-3">{fmtDate(tx.created_at)}</TableCell>
                      <TableCell className="py-3">
                        <span className="flex items-center">
                          {getTypeIcon(tx.type)}
                          <span className="ml-2">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 text-right font-medium ${
                          tx.type === "deposit" || tx.type === "reward" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {fmtAmount(tx.amount)}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="flex items-center">
                          {getStatusContent(tx.status)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-neutral-700"
                            onClick={() => copyHash(tx.tx_hash)}
                            disabled={!tx.tx_hash}
                          >
                            {copiedHash === tx.tx_hash ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-neutral-400" />
                            )}
                          </Button>
                          {tx.tx_hash ? (
                            <Link
                              href={`https://bscscan.com/tx/${tx.tx_hash}`}
                              target="_blank"
                              className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center font-mono text-xs"
                            >
                              {tx.tx_hash.substring(0, 6)}...
                              <ExternalLinkIcon className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          ) : (
                            <span className="text-neutral-500 font-mono text-xs">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {transactions.length >= TRANSACTIONS_LIMIT && (
              <div className="pt-3 text-center">
                <p className="text-xs text-neutral-500">Showing last {TRANSACTIONS_LIMIT} transactions</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
