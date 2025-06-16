import React from "react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-soulpeg-dark text-soulpeg-light">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-soulpeg-accent-blue hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-soulpeg-gray mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              SoulPeg Labs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our decentralized staking protocol and related services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect information in the following ways:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Wallet addresses when you connect to our protocol</li>
              <li>Transaction data related to your interactions with our smart contracts</li>
              <li>Technical information such as IP addresses, browser type, and device information</li>
              <li>Usage data including pages visited and features used</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Facilitate your interactions with the SoulPeg protocol</li>
              <li>Improve our services and user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Communicate important updates about the protocol</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p className="mb-4">
              Our protocol may interact with third-party services such as blockchain networks, wallet providers, and analytics services. We are not responsible for the privacy practices of these third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to object to certain processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@soulpeg.io<br />
              Telegram: <a href="https://t.me/soulpeg" className="text-soulpeg-accent-blue hover:underline">@soulpeg</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}