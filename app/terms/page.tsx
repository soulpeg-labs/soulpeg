import React from "react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-soulpeg-dark text-soulpeg-light">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-soulpeg-accent-blue hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-soulpeg-gray mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the SoulPeg protocol, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              SoulPeg is a decentralized staking protocol that allows users to lock USDC tokens and receive sUSDC (soulbound USDC) tokens in return. The protocol operates on blockchain technology and is subject to the inherent risks of decentralized systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">As a user of the SoulPeg protocol, you agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintain the security of your wallet and private keys</li>
              <li>Understand the risks associated with blockchain technology and DeFi protocols</li>
              <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              <li>Not use the protocol for any illegal or unauthorized purpose</li>
              <li>Accept full responsibility for your transactions and interactions with the protocol</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Risk Disclosure</h2>
            <p className="mb-4">
              Using the SoulPeg protocol involves significant risks, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Smart contract vulnerabilities or bugs</li>
              <li>Market volatility and potential loss of funds</li>
              <li>Regulatory changes that may affect the protocol</li>
              <li>Technical failures or network congestion</li>
              <li>Loss of access to your wallet or private keys</li>
            </ul>
            <p className="mb-4">
              You acknowledge and accept these risks and agree that SoulPeg Labs is not responsible for any losses you may incur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. No Investment Advice</h2>
            <p className="mb-4">
              The information provided on this platform does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the platform's content as such. SoulPeg Labs does not recommend that any cryptocurrency should be bought, sold, or held by you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, SoulPeg Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless SoulPeg Labs and its affiliates from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these Terms of Service or your violation of any law or the rights of a third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modifications to Terms</h2>
            <p className="mb-4">
              SoulPeg Labs reserves the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page. Your continued use of the protocol after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p className="mb-4">
              These Terms of Service shall be governed and construed in accordance with the laws of the jurisdiction in which SoulPeg Labs operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@soulpeg.io<br />
              Telegram: <a href="https://t.me/soulpeg" className="text-soulpeg-accent-blue hover:underline">@soulpeg</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}