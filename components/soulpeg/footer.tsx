import Link from "next/link"
import { CodeXmlIcon, TwitterIcon, MessageSquareTextIcon, GithubIcon } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-neutral-700/60 bg-neutral-900">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2.5 mb-4">
              <CodeXmlIcon className="h-7 w-7 text-blue-500" />
              <span className="font-bold text-xl text-neutral-50">SoulPeg Labs</span>
            </Link>
            <p className="text-sm text-neutral-400">
              Decentralized soul-bound stablecoin protocol.
              <br />
              Secure. Transparent. Sustainable.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-200 mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-neutral-400 hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/docs" target="_blank" className="text-neutral-400 hover:text-blue-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#protocol" className="text-neutral-400 hover:text-blue-400">
                  Protocol Overview
                </Link>
              </li>
              <li>
                <Link href="/audits" className="text-neutral-400 hover:text-blue-400">
                  Security Audits
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-200 mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter" className="text-neutral-400 hover:text-blue-400">
                <TwitterIcon className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Telegram" className="text-neutral-400 hover:text-blue-400">
                <MessageSquareTextIcon className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="GitHub" className="text-neutral-400 hover:text-blue-400">
                <GithubIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700/60 pt-8 text-center text-sm text-neutral-500">
          &copy; {currentYear} SoulPeg Labs. All rights reserved.
          <p className="mt-2 text-xs">
            Disclaimer: Digital asset investments are subject to high market risk. Please do your own research.
          </p>
        </div>
      </div>
    </footer>
  )
}
