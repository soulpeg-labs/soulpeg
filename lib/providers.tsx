"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, http } from "wagmi"
import { bscTestnet } from "wagmi/chains"
import type { ReactNode } from "react"
import { useTheme } from "next-themes"
import "@rainbow-me/rainbowkit/styles.css"

const config = getDefaultConfig({
  appName: "SoulPeg",
  projectId: "15f16dbddecb42586966925966844188", // Replace with your WalletConnect project ID
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            isDarkMode
              ? darkTheme({
                  accentColor: "#1d4ed8",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "system",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor: "#1d4ed8",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "system",
                  overlayBlur: "small",
                })
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
