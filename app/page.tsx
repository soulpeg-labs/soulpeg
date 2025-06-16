import { Header } from "@/components/soulpeg/header"
import { Hero } from "@/components/soulpeg/hero"
import { DashboardIntro } from "@/components/soulpeg/dashboard-intro"
import { DashboardShowcase } from "@/components/soulpeg/dashboard-showcase"
import { LogoCloudMarquee } from "@/components/soulpeg/logo-cloud-marquee"
import { ResourceShowcase } from "@/components/soulpeg/resource-showcase"
import { CommunityCallout } from "@/components/soulpeg/community-callout"
import { Footer } from "@/components/soulpeg/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-neutral-900 text-neutral-100 selection:bg-blue-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <DashboardIntro />
        <DashboardShowcase />
        <LogoCloudMarquee />
        <ResourceShowcase />
        <CommunityCallout />
      </main>
      <Footer />
    </div>
  )
}
