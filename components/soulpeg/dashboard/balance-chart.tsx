"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, Area, Line, ComposedChart, ReferenceLine } from "recharts"
import { useAccount } from "wagmi"
import { useTransactions } from "@/hooks/useTransactions"

export function BalanceChart() {
  const { address } = useAccount()

  // Получаем все транзакции в хронологическом порядке (старые первые)
  const { transactions } = useTransactions(address || '', {
    ascending: true,
    limit: 0 // fetch all transaction types
  })

  // Process transactions - group by day & type
  const depositsByDate = new Map<string, number[]>()
  const rewardsByDate = new Map<string, number[]>()
  const withdrawsByDate = new Map<string, number[]>()
  const balanceByDate = new Map<string, number>()
  let runningTotal = 0

  transactions.forEach((tx) => {
    const date = tx.created_at.split("T")[0]
    const amount = Number(tx.amount) / 1e18   // keep original sign (withdraw < 0)

    // classify by type
    switch (tx.type) {
      case "deposit":
        if (!depositsByDate.has(date)) depositsByDate.set(date, [])
        depositsByDate.get(date)!.push(amount)
        runningTotal += amount
        break
      case "reward":
        if (!rewardsByDate.has(date)) rewardsByDate.set(date, [])
        rewardsByDate.get(date)!.push(amount)
        runningTotal += amount          // rewards add to balance
        break
      case "withdraw":
        if (!withdrawsByDate.has(date)) withdrawsByDate.set(date, [])
        withdrawsByDate.get(date)!.push(amount)  // amount is already negative
        runningTotal += amount                   // add the negative value
        break
    }

    balanceByDate.set(date, runningTotal)
  })

  // Build chart data
  const chartData = []
  // Use all keys from all types to get date range
  const allDatesSet = new Set([
    ...Array.from(depositsByDate.keys()),
    ...Array.from(rewardsByDate.keys()),
    ...Array.from(withdrawsByDate.keys())
  ])
  const allDates = Array.from(allDatesSet).sort()
  if (allDates.length > 0) {
    const firstDate = new Date(allDates[0])
    const lastDate = new Date(allDates[allDates.length - 1])
    const startDate = new Date(firstDate)
    startDate.setDate(startDate.getDate() - 2)
    const endDate = new Date(lastDate)
    endDate.setDate(endDate.getDate() + 2)
    let currentBalance = 0
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const deposits = depositsByDate.get(dateStr) || []
      const rewards = rewardsByDate.get(dateStr) || []
      const withdraws = withdrawsByDate.get(dateStr) || []

      if (deposits.length || rewards.length || withdraws.length) {
        currentBalance = balanceByDate.get(dateStr) || currentBalance
      }

      const totalDayDeposit = deposits.reduce((s, d) => s + d, 0)
      const totalDayReward = rewards.reduce((s, d) => s + d, 0)
      // withdrawals kept as **negative** numbers (bar points downward)
      const totalDayWithdraw = withdraws.reduce((s, d) => s + d, 0)

      chartData.push({
        date: dateStr,
        balance: currentBalance,
        deposit: totalDayDeposit,
        reward: totalDayReward,
        withdraw: totalDayWithdraw,
        deposits,
        rewards,
        withdraws
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
  } else {
    // No transactions - show empty chart for last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      chartData.push({
        date: d.toISOString().split("T")[0],
        balance: 0,
        deposit: 0,
        reward: 0,
        withdraw: 0,
        deposits: [],
        rewards: [],
        withdraws: []
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  // Custom tooltip to show multiple deposits and rewards
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null
    const data = payload[0].payload
    return (
      <div className="bg-neutral-800 p-3 rounded-lg shadow-lg border border-neutral-700">
        <p className="text-sm font-medium mb-2 text-neutral-200">{formatDate(label)}</p>
        {data.deposits && data.deposits.length > 0 && (
          <div className="space-y-1 mb-2">
            {data.deposits.map((dep: number, idx: number) => (
              <p key={idx} className="text-sm text-green-400">
                Deposit {data.deposits.length > 1 ? `#${idx + 1}` : ''}: ${dep.toFixed(2)}
              </p>
            ))}
          </div>
        )}
        {data.rewards && data.rewards.length > 0 && (
          <div className="space-y-1 mb-2">
            {data.rewards.map((rew: number, idx: number) => (
              <p key={idx} className="text-sm text-yellow-400">
                Reward {data.rewards.length > 1 ? `#${idx + 1}` : ''}: ${rew.toFixed(2)}
              </p>
            ))}
          </div>
        )}
        {data.withdraws && data.withdraws.length > 0 && (
          <div className="space-y-1 mb-2">
            {data.withdraws.map((wd: number, idx: number) => (
              <p key={idx} className="text-sm text-red-400">
                Withdraw {data.withdraws.length > 1 ? `#${idx + 1}` : ''}: -${wd.toFixed(2)}
              </p>
            ))}
          </div>
        )}
        <p className="text-sm text-blue-400 font-medium">
          Total Balance: ${data.balance.toFixed(2)}
        </p>
      </div>
    )
  }

  return (
    <Card className="bg-neutral-800/50 border-neutral-700/70 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-100 flex items-center">
          <BarChartIcon className="h-6 w-6 mr-3 text-blue-400" />
          Deposit History & Balance Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barCategoryGap={4}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                stroke="rgba(255,255,255,0.2)"
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                domain={[
                  (dataMin: number) => dataMin * 1.1,   // немного запасу вниз
                  (dataMax: number) => dataMax * 1.1    // и вверх
                ]}
                stroke="rgba(255,255,255,0.2)"
              />
              <ReferenceLine
                y={0}
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="4 4"
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Area under the balance line */}
              <Area
                type="monotone"
                dataKey="balance"
                stroke="none"
                fill="url(#colorBalance)"
                fillOpacity={0.2}
                dot={false}
              />

              {/* Line for balance */}
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
              />

              {/* Bars for deposits (stacked положительные) */}
              <Bar
                dataKey="deposit"
                stackId="pos"
                barSize={8}
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />

              {/* Bars for rewards (также положительные) */}
              <Bar
                dataKey="reward"
                stackId="pos"
                barSize={8}
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />

              {/* Bars for withdrawals (отрицательные, отдельный стек) */}
              <Bar
                dataKey="withdraw"
                stackId="neg"
                barSize={8}
                fill="#ef4444"
                radius={[0, 0, 4, 4]}
                opacity={0.9}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with deposit count */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-neutral-400">
              Deposits {transactions.filter(t => t.type === "deposit").length > 0 && `(${transactions.filter(t => t.type === "deposit").length})`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
            <span className="text-neutral-400">
              Rewards {transactions.filter(t => t.type === "reward").length > 0 && `(${transactions.filter(t => t.type === "reward").length})`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
            <span className="text-neutral-400">
              Withdrawals {transactions.filter(t => t.type === "withdraw").length > 0 && `(${transactions.filter(t => t.type === "withdraw").length})`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-neutral-400">Total Balance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
