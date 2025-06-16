import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { mutate as globalMutate } from "swr"

export function useRealtimeWallet(wallet?: string) {
    useEffect(() => {
        if (!wallet) return

        const channel = supabase
            .channel(`wallet:${wallet}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "transactions",
                    filter: `wallet=eq.${wallet}`,
                },
                () => {
                    // ① обновляем точный ключ активных стейков
                    globalMutate(["active-stakes", wallet])
                    // ② обновляем все SWR‑кэши вида ["tx", wallet, …]
                    globalMutate(
                        (key: unknown) =>
                            Array.isArray(key) && key[0] === "tx" && key[1] === wallet
                    )

                    globalMutate(["bal-susdc", wallet])
                    globalMutate(["bal-usdc", wallet])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [wallet])
}