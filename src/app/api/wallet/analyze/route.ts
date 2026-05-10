import { WalletMetrics } from '@/lib/types';
import { simulatedWalletMetrics } from '@/lib/wallet-analysis';

type CacheEntry = {
  expiresAt: number;
  payload: {
    source: 'wallet' | 'simulated';
    metrics: WalletMetrics;
    insights: string[];
    fallbackReason?: string;
  };
};

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

function mapTransactionsToMetrics(transactions: any[]): WalletMetrics {
  const timestamps = transactions.map((tx) => Number(tx.timestamp ?? 0)).filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);
  const minTs = timestamps.length ? Math.min(...timestamps) : Math.floor(Date.now() / 1000);
  const maxTs = timestamps.length ? Math.max(...timestamps) : Math.floor(Date.now() / 1000);
  const ageDays = Math.max(1, (maxTs - minTs) / 86400);
  const txFrequency = clamp((transactions.length / ageDays) * 8);

  const tokenSymbols = new Set<string>();
  let memeTransfers = 0;
  let stablecoinTransfers = 0;
  let nftTx = 0;
  let defiTx = 0;
  let swapTx = 0;
  let lateNightTx = 0;
  const knownStable = ['USDC', 'USDT', 'DAI', 'PYUSD'];
  const memeKeywords = ['DOG', 'PEPE', 'BONK', 'WIF', 'CAT', 'INU', 'MEME'];

  for (const tx of transactions) {
    const tokenTransfers = Array.isArray(tx.tokenTransfers) ? tx.tokenTransfers : [];
    const source = String(tx.source ?? '').toLowerCase();
    const type = String(tx.type ?? '').toLowerCase();
    const hour = new Date(Number(tx.timestamp ?? 0) * 1000).getUTCHours();

    if (hour >= 0 && hour < 6) lateNightTx += 1;
    if (source.includes('jupiter') || source.includes('raydium') || type.includes('swap')) swapTx += 1;
    if (source.includes('marinade') || source.includes('kamino') || source.includes('drift') || source.includes('jito')) defiTx += 1;
    if (type.includes('nft') || source.includes('magiceden') || source.includes('tensor')) nftTx += 1;

    for (const transfer of tokenTransfers) {
      const symbol = String(transfer.tokenSymbol ?? transfer.symbol ?? '').toUpperCase();
      if (!symbol) continue;
      tokenSymbols.add(symbol);
      if (knownStable.some((stable) => symbol.includes(stable))) stablecoinTransfers += 1;
      if (memeKeywords.some((keyword) => symbol.includes(keyword))) memeTransfers += 1;
    }
  }

  const tokenDiversity = clamp(tokenSymbols.size * 4);
  const totalTransfers = Math.max(1, stablecoinTransfers + memeTransfers + tokenSymbols.size);
  const memeExposure = clamp((memeTransfers / totalTransfers) * 100);
  const stablecoinRatio = clamp((stablecoinTransfers / totalTransfers) * 100);
  const tradingVolatility = clamp((swapTx / Math.max(1, transactions.length)) * 100);
  const buySellFrequency = clamp((swapTx / Math.max(1, ageDays)) * 7);
  const avgHoldingDays = clamp(190 - buySellFrequency * 1.8, 1, 220);
  const concentration = clamp(100 - Math.min(tokenSymbols.size * 6, 80), 10, 98);

  return {
    transactionFrequency: txFrequency,
    tokenDiversity,
    memeCoinExposure: memeExposure,
    tradingVolatility,
    buySellFrequency,
    averageHoldingDurationDays: avgHoldingDays,
    nftActivity: clamp((nftTx / Math.max(1, transactions.length)) * 100),
    defiInteraction: clamp((defiTx / Math.max(1, transactions.length)) * 100),
    stablecoinRatio,
    portfolioConcentration: concentration,
    walletAgeDays: Math.max(7, ageDays),
    lateNightTradingRatio: clamp((lateNightTx / Math.max(1, transactions.length)) * 100),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get('address')?.trim();
  if (!address) {
    return Response.json({ error: 'Missing address' }, { status: 400 });
  }

  const cached = responseCache.get(address);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json(cached.payload);
  }

  const heliusKey = process.env.HELIUS_API_KEY;
  if (!heliusKey) {
    return Response.json({
      source: 'simulated' as const,
      metrics: simulatedWalletMetrics(address),
      insights: ['Live API key not configured. Using deterministic wallet simulation for this session.'],
      fallbackReason: 'HELIUS_API_KEY is not configured in this environment.',
    });
  }

  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${heliusKey}&limit=100`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch wallet activity from Helius.' }, { status: response.status });
    }

    const transactions = await response.json();
    const metrics = mapTransactionsToMetrics(Array.isArray(transactions) ? transactions : []);
    const payload = {
      source: 'wallet' as const,
      metrics,
      insights: [
        metrics.memeCoinExposure > 60 ? 'Detected high meme coin exposure' : 'Meme exposure remains under control',
        metrics.lateNightTradingRatio > 45 ? 'Wallet shows late-night trading behavior' : 'Trading activity follows daytime cycles',
        metrics.portfolioConcentration > 70 ? 'Portfolio concentration is elevated' : 'Portfolio appears diversified',
      ],
    };

    responseCache.set(address, { payload, expiresAt: Date.now() + CACHE_TTL_MS });
    return Response.json(payload);
  } catch {
    const fallback = {
      source: 'simulated' as const,
      metrics: simulatedWalletMetrics(address),
      insights: ['Live wallet fetch failed. Generated deterministic fallback metrics from address behavior seed.'],
      fallbackReason: 'Helius request failed. Falling back to deterministic simulation.',
    };
    return Response.json(fallback, { status: 200 });
  }
}
