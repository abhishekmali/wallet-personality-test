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

export interface WalletData {
  address: string;
  transactionCount?: number;
  tokenCount?: number;
  nftCount?: number;
}

export interface AnalysisMessage {
  text: string;
  icon: string;
  delay: number;
}
