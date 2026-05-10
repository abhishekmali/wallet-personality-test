import { WalletMetrics } from '@/lib/types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const hashSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seeded = (seed: string, salt: number, min: number, max: number) => {
  const value = (hashSeed(`${seed}-${salt}`) % 1000) / 1000;
  return min + value * (max - min);
};

export function simulatedWalletMetrics(address: string): WalletMetrics {
  return {
    transactionFrequency: clamp(seeded(address, 1, 12, 95)),
    tokenDiversity: clamp(seeded(address, 2, 8, 95)),
    memeCoinExposure: clamp(seeded(address, 3, 2, 98)),
    tradingVolatility: clamp(seeded(address, 4, 15, 96)),
    buySellFrequency: clamp(seeded(address, 5, 8, 92)),
    averageHoldingDurationDays: seeded(address, 6, 1, 200),
    nftActivity: clamp(seeded(address, 7, 0, 85)),
    defiInteraction: clamp(seeded(address, 8, 0, 88)),
    stablecoinRatio: clamp(seeded(address, 9, 2, 95)),
    portfolioConcentration: clamp(seeded(address, 10, 10, 98)),
    walletAgeDays: seeded(address, 11, 60, 1600),
    lateNightTradingRatio: clamp(seeded(address, 12, 5, 75)),
  };
}

export interface WalletAnalysisApiResponse {
  source: 'wallet' | 'simulated';
  metrics: WalletMetrics;
  insights: string[];
  fallbackReason?: string;
}
