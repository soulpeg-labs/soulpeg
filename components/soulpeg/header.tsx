"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CodeXmlIcon, ExternalLinkIcon, MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ConnectButtonWrapper } from "@/components/connect-button-wrapper"
import { useAccount } from "wagmi"

export function Header() {
  const { isConnected } = useAccount()
  
  const navLinks = [
    { name: "Protocol", href: "#protocol" },
    { name: "Developers", href: "#developers" },
    { name: "Community", href: "#community" },
    { name: "Docs", href: "/docs", external: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-700/60 bg-neutral-900/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-1.5 md:space-x-2.5">
          <CodeXmlIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          <span className="font-bold text-xl md:text-2xl text-neutral-50">SoulPeg</span>
          <span className="hidden sm:inline-block text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium border border-blue-500/30">
            Labs
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors flex items-center"
            >
              {link.name}
              {link.external && <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          {isConnected && (
            <Button
              variant="ghost"
              className="hidden sm:flex text-neutral-300 hover:bg-neutral-700 hover:text-white"
              asChild
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <div className="hidden sm:block">
            <ConnectButtonWrapper />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 border-0 bg-transparent hover:bg-neutral-800 text-neutral-300"
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-neutral-900 border-neutral-700 text-neutral-100 w-[280px]">
                <div className="flex flex-col space-y-4 p-6">
                  <Link href="/" className="flex items-center space-x-2.5 mb-4">
                    <CodeXmlIcon className="h-7 w-7 text-blue-500" />
                    <span className="font-bold text-xl text-neutral-50">SoulPeg Labs</span>
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : ""}
                      className="text-base font-medium text-neutral-300 hover:text-blue-400 transition-colors flex items-center"
                    >
                      {link.name}
                      {link.external && <ExternalLinkIcon className="ml-1.5 h-4 w-4" />}
                    </Link>
                  ))}
                  <div className="mt-6 pt-6 border-t border-neutral-700 space-y-4">
                    {isConnected && (
                      <Link
                        href="/dashboard"
                        className="block text-base font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Go to Dashboard
                      </Link>
                    )}
                    <div className="w-full">
                      <ConnectButtonWrapper />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
