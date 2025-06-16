import Image from "next/image"

// Define 3-4 actual partners/integrations with custom sizing hints
const partners = [
  { name: "Circle", src: "/partners/circle.svg", scale: 1 },
  { name: "Binance Smart Chain", src: "/partners/bsc.svg", scale: 1 },
  { name: "CoinMarketCap", src: "/partners/cmc.svg", scale: 1 },
  { name: "CoinGecko", src: "/partners/coingecko.svg", scale: 1 },
]

// Create a longer array for smoother animation
const marqueeLogos = [...partners, ...partners, ...partners]

const MarqueeContent = ({ logos }: { logos: { name: string; src: string; scale?: number }[] }) => (
  <>
    {logos.map((logo, index) => (
      <div
        key={`${logo.name}-${index}`}
        className="flex-shrink-0 px-10 md:px-14" // Increased padding for more spacing
      >
        <div className="relative h-16 w-40 md:h-20 md:w-48 flex items-center justify-center"> {/* Larger container for better visibility */}
          <Image
            src={logo.src || "/placeholder.svg"}
            alt={logo.name}
            fill
            className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            style={{ transform: `scale(${logo.scale || 1})` }} // Apply individual scaling
            sizes="(max-width: 768px) 160px, 192px"
          />
        </div>
      </div>
    ))}
  </>
)

export function LogoCloudMarquee() {
  if (partners.length === 0) {
    return null // Don't render if no partners
  }

  return (
    <section className="py-16 md:py-20 bg-neutral-900 border-y border-neutral-700/60 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10 md:mb-14 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-300 tracking-tight">
          Trusted By & Integrated With
        </h2>
      </div>
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee">
            <MarqueeContent logos={marqueeLogos} />
          </div>
          <div className="flex animate-marquee" aria-hidden="true">
            <MarqueeContent logos={marqueeLogos} />
          </div>
        </div>
      </div>
    </section>
  )
}
