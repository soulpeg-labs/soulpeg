import Link from "next/link"
import { MessageSquareTextIcon, TwitterIcon, UsersIcon, ArrowRightIcon } from "lucide-react"

const communityLinks = [
  {
    name: "Join Telegram",
    href: "https://t.me/soulpeg",
    icon: MessageSquareTextIcon,
    description: "Real-time discussions & support.",
  },
  { name: "Follow on X (Twitter)", href: "https://x.com/soulpeglabs", icon: TwitterIcon, description: "Latest news & announcements." },
  { name: "Governance Forum", href: "#forum", icon: UsersIcon, description: "Shape the future of SoulPeg." },
]

export function CommunityCallout() {
  return (
    <section id="community" className="py-16 md:py-24 bg-neutral-800/30 border-t border-neutral-700/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">Become Part of SoulPeg</h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            Connect with our vibrant community, contribute to discussions, and stay updated.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {communityLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-neutral-800/50 p-6 rounded-xl border border-neutral-700/70 shadow-lg hover:border-blue-500/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3">
                <link.icon className="h-7 w-7 text-blue-500 mr-4" />
                <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">
                  {link.name}
                </h3>
              </div>
              <p className="text-sm text-neutral-400 mb-4">{link.description}</p>
              <span className="text-xs text-blue-400 font-medium flex items-center group-hover:underline">
                Connect Now{" "}
                <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
