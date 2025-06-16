import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import "./rainbow-kit-overrides.css" // Добавляем импорт стилей для RainbowKit
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/lib/providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SoulPeg Labs | 1 USD Soul-Bound Staking Token",
  description: "Soul-bound stablecoin pegged exactly to $1 — stake & earn.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-soulpeg.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            {children}
            <Toaster position="bottom-right" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
