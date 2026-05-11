import { WalletMetrics } from './types';

export function generateDemoWalletMetrics(quizAnswers: Record<string, 'A' | 'B'>): WalletMetrics {
  // We use the quiz answers to "guess" what their wallet might look like in demo mode
  // But we add some variance to make it look realistic
  
  let risk = 50;
  let meme = 30;
  let patience = 50;
  let conviction = 50;

  if (quizAnswers['q1'] === 'A') risk += 15;
  if (quizAnswers['q2'] === 'B') risk += 20;
  if (quizAnswers['q4'] === 'B') meme += 40;
  if (quizAnswers['q5'] === 'A') patience += 30;

  return {
    txCount: Math.floor(Math.random() * 100) + 10,
    memeExposure: Math.min(100, Math.max(0, meme + (Math.random() * 20 - 10))),
    riskScore: Math.min(100, Math.max(0, risk + (Math.random() * 20 - 10))),
    patienceScore: Math.min(100, Math.max(0, patience + (Math.random() * 20 - 10))),
    convictionScore: Math.min(100, Math.max(0, conviction + (Math.random() * 20 - 10))),
    diversification: Math.floor(Math.random() * 60) + 20,
    stabilityScore: Math.floor(Math.random() * 70) + 15,
  };
}

export function generateSimulatedWalletMetrics(address: string): WalletMetrics {
  // Deterministic based on address
  let seed = 0;
  for (let i = 0; i < address.length; i++) seed += address.charCodeAt(i);
  
  const rng = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * 101);
  };

  return {
    txCount: rng(1),
    memeExposure: rng(2),
    riskScore: rng(3),
    patienceScore: rng(4),
    convictionScore: rng(5),
    diversification: rng(6),
    stabilityScore: rng(7),
  };
}
