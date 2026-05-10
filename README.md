# 🔮 Wallet Personality Test

An emotionally engaging, cinematic web experience that analyzes your Solana wallet behavior and transforms it into a psychologically accurate trader archetype.

Built with **Next.js 15**, **Framer Motion**, and **Helius API**.

## 🚀 Features

- **Live Wallet Analysis:** Fetches real on-chain data using Helius.
- **Psychological Profiling:** Blends on-chain behavior with personality quiz insights.
- **Cinematic UI:** Premium dark-mode aesthetic with fluid animations.
- **Shareable Result Cards:** Generate and download your personality profile to share on social media.

---

## 🛠️ Setup Instructions

To run this project locally, you will need a Solana RPC/API key from Helius.

### 1. Get a Helius API Key
1. Go to [helius.dev](https://helius.dev/).
2. Sign up for a free account.
3. Copy your **API Key** from the dashboard.

### 2. Configure Environment Variables
Create a file named `.env.local` in the root directory:

```bash
touch .env.local
```

Open `.env.local` and add your key:

```env
HELIUS_API_KEY=your_helius_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub (the `.env.local` will be ignored automatically).
2. Connect your repository to [Vercel](https://vercel.com/).
3. In the Vercel project settings, go to **Environment Variables**.
4. Add `HELIUS_API_KEY` with your actual key.
5. Deploy!

---

## 🧩 Archetypes
The app identifies 10 unique personality types, including:
- **Diamond Hands Monk:** Inner peace through unrealized gains.
- **Meme Coin Goblin:** Degen is a lifestyle, not a strategy.
- **Panic Seller:** First to sell, last to profit.
- **Exit Liquidity Provider:** Whales thank you for your service.
- *...and more.*
