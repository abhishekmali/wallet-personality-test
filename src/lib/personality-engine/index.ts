import { getArchetypeById } from '@/lib/archetypes';
import { quizCalibrationFromAnswers } from '@/lib/demo-generator';
import { AnalysisMode, AnalysisResult, TraitScore, WalletMetrics } from '@/lib/types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const TRAIT_COLORS: Record<string, string> = {
  'Risk Appetite': '#F97316',
  Conviction: '#818CF8',
  'Emotional Volatility': '#FF4FD8',
  Patience: '#7C5CFF',
  'Meme Exposure': '#4ADE80',
};

function buildTraitScores(metrics: WalletMetrics, quizAnswers: Record<string, 'A' | 'B'>, calibrationWeight: number): TraitScore[] {
  const quiz = quizCalibrationFromAnswers(quizAnswers);
  const walletScores = {
    'Risk Appetite': clamp((metrics.tradingVolatility * 0.35) + (metrics.memeCoinExposure * 0.3) + (metrics.buySellFrequency * 0.35)),
    Conviction: clamp((100 - metrics.buySellFrequency) * 0.35 + (metrics.averageHoldingDurationDays / 2) * 0.3 + (100 - metrics.portfolioConcentration) * 0.35),
    'Emotional Volatility': clamp((metrics.buySellFrequency * 0.5) + (metrics.lateNightTradingRatio * 0.3) + (metrics.tradingVolatility * 0.2)),
    Patience: clamp((metrics.averageHoldingDurationDays / 2) * 0.7 + (100 - metrics.buySellFrequency) * 0.3),
    'Meme Exposure': clamp(metrics.memeCoinExposure),
  };
  const quizScores = {
    'Risk Appetite': quiz.riskAppetite,
    Conviction: quiz.conviction,
    'Emotional Volatility': clamp(100 - quiz.emotionalStability),
    Patience: quiz.patience,
    'Meme Exposure': quiz.memeExposure,
  };

  return Object.entries(walletScores).map(([name, walletScore]) => ({
    name,
    value: clamp(walletScore * (1 - calibrationWeight) + quizScores[name as keyof typeof quizScores] * calibrationWeight),
    color: TRAIT_COLORS[name] ?? '#00D4FF',
  }));
}

function pickArchetype(metrics: WalletMetrics, traits: TraitScore[]) {
  const getTrait = (name: string) => traits.find((trait) => trait.name === name)?.value ?? 50;
  const risk = getTrait('Risk Appetite');
  const conviction = getTrait('Conviction');
  const volatility = getTrait('Emotional Volatility');
  const patience = getTrait('Patience');
  const meme = getTrait('Meme Exposure');

  if (meme > 85 && metrics.transactionFrequency > 70 && metrics.averageHoldingDurationDays < 14) return 'meme-coin-goblin';
  if (metrics.stablecoinRatio > 65 && metrics.buySellFrequency < 35 && patience > 70) return 'diamond-hands-monk';
  if (volatility > 75 && metrics.buySellFrequency > 70) return 'emotional-swing-trader';
  if (risk > 85 && metrics.portfolioConcentration > 75 && patience < 30) return 'chaotic-ape';
  if (metrics.nftActivity > 60 && metrics.tokenDiversity < 60) return 'nft-archaeologist';
  if (metrics.defiInteraction > 65 && metrics.tokenDiversity > 60) return 'yield-chaser';
  if (metrics.lateNightTradingRatio > 55 && metrics.buySellFrequency > 60) return 'midnight-gambler';
  if (conviction < 30 && volatility > 65) return 'panic-seller';
  if (meme > 70 && conviction < 40) return 'exit-liquidity';
  return 'gas-fee-minimalist';
}

function buildInsights(metrics: WalletMetrics) {
  const walletSignals = [
    metrics.memeCoinExposure > 60 ? 'Detected high meme coin exposure' : 'Meme exposure is relatively contained',
    metrics.lateNightTradingRatio > 45 ? 'Wallet shows late-night trading behavior' : 'Trading behavior follows stable daytime cadence',
    metrics.tradingVolatility > 65 ? 'Strong preference for volatile assets' : 'Lower volatility preference detected',
    metrics.averageHoldingDurationDays > 60 ? 'High conviction holding windows detected' : 'Short holding windows indicate active rotation',
    metrics.portfolioConcentration > 70 ? 'Portfolio concentration is above average' : 'Portfolio diversification appears balanced',
  ];

  return {
    walletSignals,
    onchainBehavior: [
      `Transaction activity score: ${Math.round(metrics.transactionFrequency)}/100`,
      `Token diversity score: ${Math.round(metrics.tokenDiversity)}/100`,
      `Stablecoin allocation: ${Math.round(metrics.stablecoinRatio)}%`,
    ],
    detectedPatterns: [
      metrics.buySellFrequency > 65 ? 'High-frequency in/out positioning' : 'Measured rebalance cadence',
      metrics.defiInteraction > 50 ? 'Frequent DeFi protocol interactions' : 'Limited DeFi experimentation',
      metrics.walletAgeDays > 365 ? 'Wallet behavior shaped by multi-cycle exposure' : 'Wallet appears to be in a newer growth phase',
    ],
    emotionalTraits: [
      metrics.buySellFrequency > 70 ? 'FOMO sensitivity detected during momentum moves' : 'Lower impulse-chasing tendency',
      metrics.tradingVolatility > 70 ? 'Higher emotional response to rapid price swings' : 'Calmer response to volatility',
      metrics.averageHoldingDurationDays > 45 ? 'Patience profile supports conviction holds' : 'Prefers tactical, shorter-duration trades',
    ],
  };
}

export function generatePersonalityResult(args: {
  mode: AnalysisMode;
  dataSource: 'wallet' | 'simulated';
  metrics: WalletMetrics;
  quizAnswers: Record<string, 'A' | 'B'>;
  fallbackReason?: string;
}): AnalysisResult {
  const calibrationImpact = args.mode === 'wallet' ? 0.15 : 0.85;
  const traitScores = buildTraitScores(args.metrics, args.quizAnswers, calibrationImpact);
  const archetypeId = pickArchetype(args.metrics, traitScores);
  const archetype = getArchetypeById(archetypeId) ?? getArchetypeById('gas-fee-minimalist');

  if (!archetype) {
    throw new Error('Archetype resolution failed');
  }

  const insights = buildInsights(args.metrics);
  const confidence = args.dataSource === 'wallet' ? 88 : 72;

  return {
    archetype: { ...archetype, traits: traitScores },
    mode: args.mode,
    dataSource: args.dataSource,
    confidence,
    walletMetrics: args.metrics,
    traitScores,
    calibrationImpact,
    fallbackReason: args.fallbackReason,
    ...insights,
  };
}
