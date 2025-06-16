import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, GithubIcon, ShieldAlertIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react"

const resources = [
  {
    title: "Comprehensive Docs",
    description: "Dive deep into protocol mechanics, API references, and integration guides.",
    icon: BookOpenIcon,
    href: "/docs",
    cta: "Explore Docs",
    external: true,
  },
  {
    title: "Open Source Code",
    description: "Inspect our smart contracts and contribute to the SoulPeg ecosystem on GitHub.",
    icon: GithubIcon,
    href: "https://github.com/soulpeg",
    cta: "View on GitHub",
    external: true,
  },
  {
    title: "Smart Contract Audits",
    description: "Review detailed security assessments conducted by leading third-party auditors.",
    icon: ShieldAlertIcon,
    href: "/audits",
    cta: "See Audit Reports",
    external: false,
  },
]

export function ResourceShowcase() {
  return (
    <section id="developers" className="py-16 md:py-24 bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
            For Developers & Researchers
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            Access all the tools and information you need to build with or analyze SoulPeg.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="bg-neutral-800/40 p-8 rounded-xl border border-neutral-700/60 shadow-lg flex flex-col transition-all hover:shadow-blue-500/20 hover:border-blue-500/40"
            >
              <resource.icon className="h-10 w-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold text-neutral-100 mb-3">{resource.title}</h3>
              <p className="text-neutral-400 text-sm mb-6 flex-grow">{resource.description}</p>
              <Button
                className="bg-neutral-900 border border-blue-500/30 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-blue-500/50 w-full group transition-all"
                asChild
              >
                <Link href={resource.href} target={resource.external ? "_blank" : "_self"}>
                  {resource.cta}
                  {resource.external ? (
                    <ExternalLinkIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
