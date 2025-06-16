import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CodeXmlIcon, LogOutIcon, UserCircleIcon, SettingsIcon, BellIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const userAddress = "0x5B...a17b" // Placeholder
  const bnbBalance = "0.298" // Placeholder

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-700/60 bg-neutral-900/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2.5">
          <CodeXmlIcon className="h-8 w-8 text-blue-500" />
          <span className="font-bold text-2xl text-neutral-50">SoulPeg</span>
          <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full font-medium border border-neutral-600">
            Dashboard
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-700/70 hover:border-neutral-600 text-neutral-300 px-4 py-2 h-10"
              >
                <UserCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span className="hidden sm:inline">
                  {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </span>
                <span className="sm:hidden">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-100 w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Connected Wallet</p>
                  <p className="text-xs leading-none text-neutral-400">{userAddress}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="hover:bg-neutral-700/50 cursor-pointer">
                <span className="text-sm text-neutral-300">{bnbBalance} BNB</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-neutral-700/50 cursor-pointer">
                <SettingsIcon className="mr-2 h-4 w-4 text-neutral-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 hover:!text-red-300 cursor-pointer">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
