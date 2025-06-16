import useSWR from "swr"
import { supabase } from "../lib/supabase"

export interface StakeData {
  id: string          // stake_id
  amount: string      // amount (decimal, "210.00")
  unlockTime: number  // unix timestamp (sec)
  earned: string      // earned yield (decimal)
  isUnlocked: boolean // whether unlock() has been called
}

/**
 * Fetches active stakes for a given wallet address
 * Returns stake positions grouped by stake_id with their current earned yield
 */
export function useActiveStakes(address: string | undefined) {
  const key = address ? ["active-stakes", address] : null

  const fetcher = async () => {
    if (!address) return []

    try {
      // View already returns only open (not‑closed) stakes
      const { data: rows, error: viewError } = await supabase
        .from("v_active_stakes")
        .select(`
          stake_id,
          wallet,
          amount_wei,
          earned_wei,
          lock_until,
          is_unlocked
        `)
        .eq("wallet", address)
        .ilike(
          "contract_address",
          (process.env.NEXT_PUBLIC_STUSDC_ADDRESS ?? "").toLowerCase()
        ) // фильтр по текущему контракту, без учёта регистра
        .order("lock_until", { ascending: true })

      if (viewError) throw viewError

      const activeStakes: StakeData[] =
        rows?.map((row: any) => {
          // Supabase returns numeric columns as strings ─ convert safely to BigInt
          const amountWei = BigInt(row.amount_wei ?? "0");
          const earnedWei = BigInt(row.earned_wei ?? "0");
          return {
            id: row.stake_id as string,
            amount: (Number(amountWei) / 1e18).toFixed(2),
            earned: (Number(earnedWei) / 1e18).toFixed(2),
            unlockTime: row.lock_until
              ? Math.floor(new Date(row.lock_until).getTime() / 1000)
              : 0,
            isUnlocked: row.is_unlocked as boolean
          } as StakeData;
        }) ?? []

      return activeStakes
    } catch (error) {
      console.error("Error fetching active stakes:", error)
      throw error
    }
  }

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<StakeData[]>(key, fetcher, {
    // realtime subscription via useRealtimeWallet makes polling unnecessary
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return {
    data: data ?? [],
    error,
    isLoading,
    refetch: mutate
  }
}