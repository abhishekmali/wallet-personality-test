import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wallet Personality Test | Discover Your Crypto Archetype",
  description: "Analyze your Solana wallet and discover the trader archetype hiding behind your transactions. Find out if you're a Diamond Hands Monk, Meme Coin Goblin, or Panic Seller.",
  keywords: ["crypto", "solana", "wallet", "personality", "test", "archetype", "blockchain"],
  openGraph: {
    title: "Wallet Personality Test",
    description: "Your wallet has a personality. Discover yours.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallet Personality Test",
    description: "Your wallet has a personality. Discover yours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col noise-overlay" style={{ background: '#070B14' }}>
        {children}
      </body>
    </html>
  );
}
