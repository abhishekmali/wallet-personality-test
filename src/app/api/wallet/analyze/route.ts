import { WalletMetrics } from '@/lib/types';
import { simulatedWalletMetrics } from '@/lib/demo-generator';

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
  const txCount = transactions.length;
  
  let memeTransfers = 0;
  let swapTx = 0;
  let nftTx = 0;
  let defiTx = 0;
  const tokenSymbols = new Set<string>();

  const memeKeywords = ['DOG', 'PEPE', 'BONK', 'WIF', 'CAT', 'INU', 'MEME'];

  for (const tx of transactions) {
    const type = String(tx.type ?? '').toLowerCase();
    const source = String(tx.source ?? '').toLowerCase();
    
    if (type.includes('swap') || source.includes('jupiter') || source.includes('raydium')) swapTx += 1;
    if (type.includes('nft') || source.includes('magiceden') || source.includes('tensor')) nftTx += 1;
    if (source.includes('kamino') || source.includes('drift') || source.includes('marginfi')) defiTx += 1;

    const transfers = Array.isArray(tx.tokenTransfers) ? tx.tokenTransfers : [];
    for (const t of transfers) {
      const sym = String(t.tokenSymbol ?? '').toUpperCase();
      if (sym) {
        tokenSymbols.add(sym);
        if (memeKeywords.some(k => sym.includes(k))) memeTransfers += 1;
      }
    }
  }

  // Calculate normalized scores (0-100)
  const memeExposure = clamp((memeTransfers / Math.max(1, txCount)) * 200); 
  const riskScore = clamp((swapTx / Math.max(1, txCount)) * 150 + (memeExposure * 0.3));
  const patienceScore = clamp(100 - (swapTx / Math.max(1, txCount)) * 200);
  const convictionScore = clamp(100 - (swapTx / Math.max(1, txCount)) * 100 + (defiTx * 10));
  const stabilityScore = clamp(100 - (memeExposure * 0.5) - (swapTx * 0.2));
  const diversification = clamp(tokenSymbols.size * 5);

  return {
    txCount,
    memeExposure,
    riskScore,
    patienceScore,
    convictionScore,
    diversification,
    stabilityScore,
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
        metrics.memeExposure > 60 ? 'Detected high meme coin exposure' : 'Meme exposure remains under control',
        metrics.riskScore > 70 ? 'Wallet shows high-risk trading behavior' : 'Trading activity follows stable cycles',
        metrics.diversification > 70 ? 'Portfolio appears diversified' : 'Concentrated asset pattern detected',
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
