import useSWR from "swr"
import { useAccount, usePublicClient } from "wagmi"
import { formatUnits } from "viem"

// адреса токенов берём из env, чтобы легко переключать сеть
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`
const SUSDC_ADDRESS = process.env.NEXT_PUBLIC_STUSDC_ADDRESS as `0x${string}`



const erc20Abi = [
  {
    constant: true,
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
] as const

/**
 * Обёртка‑fetcher над wagmi readContract для SWR.
 */
function createFetcher(client: ReturnType<typeof usePublicClient>) {
  return async (
    _key: string | readonly string[],
    cfg: {
      abi: any
      address: `0x${string}`
      functionName: string
      args?: readonly unknown[]
    }
  ) => {
    if (!client) return null // skip on SSR when client is undefined
    return client.readContract({
      ...cfg,
      args: cfg.args ?? [],
    })
  }
}

/**
 * Хук возвращает:
 *  - баланс USDC кошелька
 *  - баланс sUSDC (soul‑bound токенов)
 *  - общий totalSupply sUSDC = Total Staked
 */
export function useTokenBalances() {
  const { address } = useAccount()
  const client = usePublicClient()
  const fetcher = createFetcher(client)

  const shouldFetch = !!client && !!address && !!USDC_ADDRESS && !!SUSDC_ADDRESS

  // Хардкодим decimals, так как динамическое получение не работает
  const usdcDec = 18  // Вы сказали что у USDC 18 decimals
  const susdcDec = 18 // Предполагаем что у sUSDC тоже 18

  // Убираем неиспользуемые запросы decimals
  /*
  const { data: usdcDecRaw } = useSWR(...)
  const { data: susdcDecRaw } = useSWR(...)
  */

  // ----------------- USDC Balance -----------------
  const { data: usdcRaw } = useSWR(
    shouldFetch ? ["bal-usdc", address] : null,
    (_key) =>
      fetcher(_key, {
        abi: erc20Abi,
        address: USDC_ADDRESS,
        functionName: "balanceOf",
        args: [address],
      }),
    { refreshInterval: 15_000, revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  // ----------------- sUSDC Balance -----------------
  const { data: susdcRaw } = useSWR(
    shouldFetch ? ["bal-susdc", address] : null,
    (_key) =>
      fetcher(_key, {
        abi: erc20Abi,
        address: SUSDC_ADDRESS,
        functionName: "balanceOf",
        args: [address],
      }),
    { refreshInterval: 15_000, revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  // ----------------- Total Staked -----------------
  const { data: totalSupplyRaw } = useSWR(
    SUSDC_ADDRESS ? ["susdc-total"] : null,
    (_key) =>
      fetcher(_key, {
        abi: erc20Abi,
        address: SUSDC_ADDRESS,
        functionName: "totalSupply",
      }),
    { refreshInterval: 30_000, revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  // Временная отладка - посмотрим что приходит
  console.log("DEBUG useTokenBalances:", {
    USDC_ADDRESS,
    SUSDC_ADDRESS,
    address,
    usdcRaw: usdcRaw?.toString(),
    susdcRaw: susdcRaw?.toString(),
    totalSupplyRaw: totalSupplyRaw?.toString(),
    decimals: { usdcDec, susdcDec }
  })

  const result = {
    isReady: shouldFetch,
    usdc: usdcRaw ? Number(formatUnits(usdcRaw as bigint, usdcDec)) : 0,
    susdc: susdcRaw ? Number(formatUnits(susdcRaw as bigint, susdcDec)) : 0,
    totalStaked: totalSupplyRaw ? Number(formatUnits(totalSupplyRaw as bigint, susdcDec)) : 0,
  }
  
  console.log("RESULT useTokenBalances:", result)
  
  return result
}