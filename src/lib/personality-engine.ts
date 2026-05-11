import { Archetype, TraitScore } from './types';
import { archetypes, getArchetypeById } from './archetypes';

export interface WalletMetrics {
  txCount: number;
  memeExposure: number; // 0-100
  riskScore: number; // 0-100
  patienceScore: number; // 0-100
  convictionScore: number; // 0-100
  diversification: number; // 0-100
  stabilityScore: number; // 0-100
}

export interface PersonalityResult {
  archetype: Archetype;
  confidence: number;
  onchainBehavior: string[];
  detectedPatterns: string[];
  emotionalTraits: string[];
  walletSignals: string[];
  calibrationImpact: number;
  mode: 'wallet' | 'demo';
  dataSource: 'wallet' | 'simulated';
  traitScores: TraitScore[];
  fallbackReason?: string;
}

interface EngineInput {
  mode: 'wallet' | 'demo';
  dataSource: 'wallet' | 'simulated';
  metrics: WalletMetrics;
  quizAnswers: Record<string, 'A' | 'B'>;
  fallbackReason?: string;
}

export function generatePersonalityResult(input: EngineInput): PersonalityResult {
  const { metrics, quizAnswers, mode, dataSource, fallbackReason } = input;

  // 1. Calculate Confidence
  // If transaction count is very low, we are less confident in the on-chain data
  const confidence = Math.min(100, Math.max(0, (metrics.txCount / 20) * 100));

  // 2. Map Quiz Answers to scores (0-100)
  const quizScores = {
    risk: 0,
    conviction: 0,
    stability: 0,
    meme: 0,
    patience: 0,
  };

  // Logic for each question (from quiz-data.ts)
  if (quizAnswers['q1'] === 'A') quizScores.risk += 20; // Missing pump hurts
  else quizScores.risk -= 10;

  if (quizAnswers['q2'] === 'B') quizScores.risk += 20; // Max chaos
  else quizScores.risk -= 10;

  if (quizAnswers['q3'] === 'A') quizScores.conviction += 20; // Buy more at -50%
  else quizScores.conviction -= 20;

  if (quizAnswers['q4'] === 'B') quizScores.meme += 20; // Already bought CT alpha
  else quizScores.meme -= 10;

  if (quizAnswers['q5'] === 'A') quizScores.patience += 20; // Months/Years
  else quizScores.patience -= 20;

  // 3. Blend Scores (Weighted Average)
  // Higher confidence means we trust wallet more. Lower confidence means we trust quiz more.
  const blendFactor = confidence / 100;
  
  const finalTraits: TraitScore[] = [
    { name: 'Risk Appetite', value: Math.round(metrics.riskScore * blendFactor + (50 + quizScores.risk) * (1 - blendFactor)), color: '#7C5CFF' },
    { name: 'Conviction', value: Math.round(metrics.convictionScore * blendFactor + (50 + quizScores.conviction) * (1 - blendFactor)), color: '#00D4FF' },
    { name: 'Emotional Stability', value: Math.round(metrics.stabilityScore * blendFactor + (50 + quizScores.stability) * (1 - blendFactor)), color: '#FF4FD8' },
    { name: 'Meme Exposure', value: Math.round(metrics.memeExposure * blendFactor + (50 + quizScores.meme) * (1 - blendFactor)), color: '#4ADE80' },
    { name: 'Patience', value: Math.round(metrics.patienceScore * blendFactor + (50 + quizScores.patience) * (1 - blendFactor)), color: '#FACC15' },
    { name: 'Diversification', value: Math.round(metrics.diversification), color: '#FB7185' },
  ];

  // 4. Select Archetype
  let selectedArchetype: Archetype;
  
  if (confidence < 5 && dataSource === 'wallet') {
    selectedArchetype = getArchetypeById('the-ghost')!;
  } else {
    // Find the closest archetype match based on blended traits
    selectedArchetype = findBestArchetypeMatch(finalTraits);
  }

  // 5. Detect Conflict Patterns
  const detectedPatterns: string[] = [];
  const walletSignals: string[] = [];
  const onchainBehavior: string[] = [];
  
  if (confidence > 40) {
    if (quizScores.risk < 0 && metrics.riskScore > 70) {
      detectedPatterns.push("The 'Closet Degen' Pattern: You claim to be safe, but your wallet tells a different story.");
    }
    if (quizScores.patience > 10 && metrics.patienceScore < 30) {
      detectedPatterns.push("The 'Impulsive Holder' Paradox: You intend to hold forever, but your fingers are itchy.");
    }
    if (metrics.memeExposure > 80) {
      walletSignals.push("Critical levels of speculative asset exposure detected.");
    }
  } else {
    detectedPatterns.push("Blockchain footprint is minimal. Analysis driven primarily by your psychological impulses.");
  }

  // Behavioral signals
  if (metrics.txCount > 50) onchainBehavior.push("High-frequency interaction pattern.");
  if (metrics.memeExposure > 50) onchainBehavior.push("Strong affinity for community-driven tokens.");
  if (metrics.patienceScore > 80) onchainBehavior.push("Diamond-hand signature detected in long-term positions.");

  return {
    archetype: selectedArchetype,
    confidence: Math.round(confidence),
    onchainBehavior,
    detectedPatterns,
    emotionalTraits: generateEmotionalTraits(finalTraits),
    walletSignals,
    calibrationImpact: Math.round(Math.abs(blendFactor - 0.5) * 100),
    mode,
    dataSource,
    traitScores: finalTraits,
    fallbackReason,
  };
}

function findBestArchetypeMatch(traits: TraitScore[]): Archetype {
  // Simple Euclidean distance match
  let bestMatch = archetypes[0];
  let minDistance = Infinity;

  const scoreMap = new Map(traits.map(t => [t.name, t.value]));

  for (const arc of archetypes) {
    if (arc.id === 'the-ghost') continue;
    
    let distance = 0;
    for (const arcTrait of arc.traits) {
      const userValue = scoreMap.get(arcTrait.name) || 0;
      distance += Math.pow(userValue - arcTrait.value, 2);
    }
    
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = arc;
    }
  }

  return bestMatch;
}

function generateEmotionalTraits(traits: TraitScore[]): string[] {
  const emotional: string[] = [];
  const risk = traits.find(t => t.name === 'Risk Appetite')?.value || 0;
  const patience = traits.find(t => t.name === 'Patience')?.value || 0;
  const stability = traits.find(t => t.name === 'Emotional Stability')?.value || 0;

  if (risk > 80) emotional.push("Adrenaline Seeker");
  if (patience > 80) emotional.push("Stoic Visionary");
  if (stability < 30) emotional.push("Emotionally Volatile");
  if (stability > 80) emotional.push("Cold-Blooded Operator");
  if (risk < 20) emotional.push("Capital Preservationist");
  
  return emotional;
}
