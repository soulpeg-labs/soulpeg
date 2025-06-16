# SoulPeg Frontend

<img src="./public/logo-soulpeg.png" alt="SoulPeg Logo" width="120" height="120">

**Secure, transparent, and sustainable yield generation on Binance Smart Chain**

SoulPeg Labs pioneers soul-bound sUSDC stablecoins, offering secure, transparent, and sustainable yield generation on the Binance Smart Chain.

## 🚀 Features

- **Modern Web3 Interface** - Built with Next.js 15 and React 19
- **Wallet Integration** - RainbowKit for seamless wallet connections
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Component Library** - Radix UI components for accessibility
- **Real-time Data** - SWR and TanStack Query for data fetching

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Web3**: Wagmi + Viem
- **Wallet**: RainbowKit
- **State Management**: SWR, TanStack Query
- **Forms**: React Hook Form + Zod

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/soulpeg-labs/soulpeg-frontend.git

# Navigate to project directory
cd soulpeg-frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Required for Web3 functionality
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🏗 Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── styles/             # Global styles and Tailwind config
└── public/             # Static assets
```

## 🚀 Deployment

This project is optimized for deployment on Vercel:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [https://soulpeg.io](https://soulpeg.io)
- **Documentation**: [https://docs.soulpeg.io](https://docs.soulpeg.io)
- **Twitter**: [@soulpeglabs](https://x.com/soulpeglabs)
- **Telegram**: [Join our community](https://t.me/soulpeg)

## ⚠️ Disclaimer

This is the frontend interface for SoulPeg protocol. The smart contracts and backend services are proprietary. This repository is intended for educational purposes and community contributions to the user interface.

---

Built with ❤️ by [SoulPeg Labs](https://github.com/soulpeg-labs) 