// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Copy,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Loader2,
//   ArrowDown,
//   ArrowUp,
//   Gift,
//   Circle
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import { useTransactions } from "@/hooks/useTransactions"
// import { useAccount } from "wagmi"
// import { Skeleton } from "@/components/ui/skeleton"

// const TRANSACTIONS_LIMIT = 20 // Увеличиваем количество транзакций для отображения
// const VISIBLE_HEIGHT = "24rem" // Примерно 6-7 строк транзакций

// // --- helpers for UI decorations -------------------------------------------

// const getTypeIcon = (type: string) => {
//   switch (type) {
//     case "deposit":
//       return <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
//     case "reward":
//       return <Gift className="h-4 w-4 text-blue-500 mr-1" />
//     case "withdraw":
//       return <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
//     default:
//       return <Circle className="h-4 w-4 text-gray-500 mr-1" />
//   }
// }

// const getStatusContent = (status: string | undefined) => {
//   switch (status) {
//     case "pending":
//       return (
//         <>
//           <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
//           <span className="ml-1 capitalize">pending</span>
//         </>
//       )
//     case "failed":
//       return (
//         <>
//           <XCircle className="h-4 w-4 text-red-500" />
//           <span className="ml-1 capitalize">failed</span>
//         </>
//       )
//     default: // "confirmed" or undefined
//       return (
//         <>
//           <CheckCircle className="h-4 w-4 text-green-500" />
//           <span className="ml-1 capitalize">confirmed</span>
//         </>
//       )
//   }
// }

// export function RecentTransactions() {
//   const { address } = useAccount()
  
//   // В dashboard кошелек уже подключен, но добавим fallback для безопасности
//   const { transactions, isLoading } = useTransactions(address || "", { limit: TRANSACTIONS_LIMIT })
//   const [copiedHash, setCopiedHash] = useState<string | null>(null)

//   const copyHash = (hash: string) => {
//     navigator.clipboard.writeText(hash)
//     setCopiedHash(hash)
//     setTimeout(() => setCopiedHash(null), 1500)
//   }

//   const fmtDate = (iso: string) =>
//     new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

//   const fmtAmount = (amount: string) => {
//     // Конвертируем из wei (18 знаков) в обычные единицы
//     const value = Number(amount) / 1e18
//     const absValue = Math.abs(value)
//     const formatted = absValue.toLocaleString('en-US', { 
//       minimumFractionDigits: 2, 
//       maximumFractionDigits: 6 
//     })
//     return value < 0 ? `-$${formatted}` : `$${formatted}`
//   }

//   return (
//     <Card className="rounded-3xl border p-6 shadow-sm hover:shadow-md transition">
//       <CardHeader className="p-0 mb-4">
//         <CardTitle className="text-lg">Recent Transactions</CardTitle>
//       </CardHeader>

//       <CardContent className="p-0">
//         {isLoading ? (
//           <div className="overflow-hidden" style={{ maxHeight: VISIBLE_HEIGHT }}>
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b text-gray-500">
//                   <th className="text-left pb-2">Date</th>
//                   <th className="text-left pb-2">Type</th>
//                   <th className="text-left pb-2">Amount</th>
//                   <th className="text-left pb-2">Status</th>
//                   <th className="text-right pb-2">Transaction ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <tr key={i} className="border-b last:border-0">
//                     <td className="py-3"><Skeleton className="h-4 w-20" /></td>
//                     <td className="py-3"><Skeleton className="h-4 w-16" /></td>
//                     <td className="py-3"><Skeleton className="h-4 w-24" /></td>
//                     <td className="py-3"><Skeleton className="h-4 w-24" /></td>
//                     <td className="py-3 text-right"><Skeleton className="h-4 w-28 ml-auto" /></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="py-12 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
//               <Clock className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-sm font-medium text-gray-900 mb-1">No transactions yet</h3>
//             <p className="text-xs text-gray-500">Your deposit transactions will appear here</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="sticky top-0 bg-white z-10">
//                 <tr className="border-b text-gray-500">
//                   <th className="text-left pb-2 bg-white">Date</th>
//                   <th className="text-left pb-2 bg-white">Type</th>
//                   <th className="text-left pb-2 bg-white">Amount</th>
//                   <th className="text-left pb-2 bg-white">Status</th>
//                   <th className="text-right pb-2 bg-white">Transaction ID</th>
//                 </tr>
//               </thead>
//             </table>
//             <div 
//               className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
//               style={{ maxHeight: VISIBLE_HEIGHT }}
//             >
//               <table className="w-full text-sm">
//                 <tbody>
//                   {transactions.map((tx /*: { status?: string }*/ ) => (
//                     <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
//                       <td className="py-3">{fmtDate(tx.created_at)}</td>
//                       <td className="py-3">
//                         <div className="flex items-center">
//                           {getTypeIcon(tx.type)}
//                           {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
//                         </div>
//                       </td>
//                       <td className="py-3">{fmtAmount(tx.amount)}</td>
//                       <td className="py-3">
//                         <div className="flex items-center">
//                           {getStatusContent(tx.status)}
//                         </div>
//                       </td>
//                       <td className="py-3 text-right">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-6 w-6 p-0 mr-2"
//                           onClick={() => copyHash(tx.tx_hash)}
//                           disabled={!tx.tx_hash}
//                         >
//                           {copiedHash === tx.tx_hash ? (
//                             <CheckCircle className="h-3 w-3 text-green-500" />
//                           ) : (
//                             <Copy className="h-3 w-3 text-gray-400" />
//                           )}
//                         </Button>
//                         <span className="text-gray-500 font-mono text-xs">
//                           {tx.tx_hash ? `${tx.tx_hash.slice(0, 6)}…` : "—"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {transactions.length >= TRANSACTIONS_LIMIT && (
//               <div className="pt-3 text-center">
//                 <p className="text-xs text-gray-500">Showing last {TRANSACTIONS_LIMIT} transactions</p>
//               </div>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }