import { quizQuestions } from '@/lib/quiz-data';
import { WalletMetrics } from '@/lib/types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function quizCalibrationFromAnswers(quizAnswers: Record<string, 'A' | 'B'>) {
  const baseline = {
    riskAppetite: 50,
    conviction: 50,
    emotionalStability: 50,
    memeExposure: 50,
    patience: 50,
  };

  for (const question of quizQuestions) {
    const answer = quizAnswers[question.id];
    if (!answer) continue;
    const delta = answer === 'A' ? question.weightA : question.weightB;
    const key = question.traitAffected as keyof typeof baseline;
    baseline[key] = clamp(baseline[key] + delta);
  }

  return baseline;
}

export function generateDemoWalletMetrics(quizAnswers: Record<string, 'A' | 'B'>): WalletMetrics {
  const quiz = quizCalibrationFromAnswers(quizAnswers);
  return {
    transactionFrequency: clamp(30 + quiz.riskAppetite * 0.5),
    tokenDiversity: clamp(35 + quiz.riskAppetite * 0.4),
    memeCoinExposure: clamp(20 + quiz.memeExposure * 0.8),
    tradingVolatility: clamp(25 + quiz.riskAppetite * 0.7),
    buySellFrequency: clamp(20 + (100 - quiz.patience) * 0.75),
    averageHoldingDurationDays: Math.max(2, 130 - quiz.patience),
    nftActivity: clamp(10 + quiz.memeExposure * 0.6),
    defiInteraction: clamp(15 + quiz.conviction * 0.55),
    stablecoinRatio: clamp(70 - quiz.riskAppetite * 0.6),
    portfolioConcentration: clamp(40 + (100 - quiz.patience) * 0.5),
    walletAgeDays: 365,
    lateNightTradingRatio: clamp(15 + quiz.riskAppetite * 0.55),
  };
}
