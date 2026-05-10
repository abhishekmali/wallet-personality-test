export interface Archetype {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  memeObservation: string;
  emotionalTendency: string;
  gradient: string;
  gradientColors: [string, string];
  accentColor: string;
  traits: TraitScore[];
  icon: string;
  mood: string;
}

export interface TraitScore {
  name: string;
  value: number; // 0 - 100
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  traitAffected: string;
  weightA: number;
  weightB: number;
}

export type AppPhase = 'landing' | 'input' | 'quiz' | 'analyzing' | 'reveal' | 'results';
export type AnalysisMode = 'wallet' | 'demo';
export type AnalysisDataSource = 'wallet' | 'simulated';

export interface WalletData {
  address: string;
  transactionCount?: number;
  tokenCount?: number;
  nftCount?: number;
}

export interface WalletMetrics {
  transactionFrequency: number;
  tokenDiversity: number;
  memeCoinExposure: number;
  tradingVolatility: number;
  buySellFrequency: number;
  averageHoldingDurationDays: number;
  nftActivity: number;
  defiInteraction: number;
  stablecoinRatio: number;
  portfolioConcentration: number;
  walletAgeDays: number;
  lateNightTradingRatio: number;
}

export interface AnalysisTrait {
  name: string;
  value: number;
  source: 'wallet' | 'quiz';
}

export interface AnalysisResult {
  archetype: Archetype;
  mode: AnalysisMode;
  dataSource: AnalysisDataSource;
  confidence: number;
  walletMetrics: WalletMetrics;
  onchainBehavior: string[];
  detectedPatterns: string[];
  walletSignals: string[];
  emotionalTraits: string[];
  traitScores: TraitScore[];
  calibrationImpact: number;
  fallbackReason?: string;
}

export interface AnalysisMessage {
  text: string;
  icon: string;
  delay: number;
}
