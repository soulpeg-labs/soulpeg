import useSWR from "swr"
import { supabase } from "../lib/supabase"

export type TransactionRow = {
  id: number
  wallet: string
  contract_address: string 
  type: "deposit" | "reward" | "withdraw"
  amount: string                 // numeric приходит строкой
  tx_hash: string
  lock_until: string | null      // ISO‑дата, null если не‑применимо
  block_number: number
  status?: "pending" | "confirmed" | "failed"
  created_at: string
}

interface TransactionOptions {
  limit?: number
  ascending?: boolean
  type?: "deposit" | "reward" | "withdraw"
}

/**
 * Возвращает транзакции указанного кошелька с гибкими опциями.
 * Скелетон показывается только на первом рендере.
 */
export function useTransactions(
  wallet: string,
  options: TransactionOptions = {}
) {
  const { limit = 5, ascending = false, type } = options
  const key = wallet ? ["tx", wallet, limit, ascending, type] : null

  const fetcher = async () => {
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("wallet", wallet)
      // адрес может быть в разных регистрах в БД ↔ .env,
      // приводим оба к lower‑case и сравниваем через ilike
      .ilike(
        "contract_address",
        (process.env.NEXT_PUBLIC_STUSDC_ADDRESS ?? "").toLowerCase()
      )

    // Фильтр по типу если указан
    if (type) {
      query = query.eq("type", type)
    }

    // Сортировка
    query = query.order("created_at", { ascending })

    // Лимит (0 или undefined = без лимита)
    if (limit && limit > 0) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error

    return data as TransactionRow[]
  }

  const { data, error, isValidating } = useSWR(key, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  // show skeleton only on the first load, avoid UI flicker on every revalidate
  const isInitialLoading = !data && !error

  return {
    transactions: data ?? [],
    isInitialLoading,
    isRefreshing: isValidating,
    error,
  }
}