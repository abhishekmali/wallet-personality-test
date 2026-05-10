import { QuizQuestion, AnalysisMessage } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What hurts more?',
    optionA: 'Missing a 100x pump',
    optionB: 'Selling too early',
    traitAffected: 'riskAppetite',
    weightA: 8,
    weightB: -5,
  },
  {
    id: 'q2',
    question: 'Your ideal trade?',
    optionA: 'Safe and steady',
    optionB: 'Maximum chaos',
    traitAffected: 'conviction',
    weightA: -5,
    weightB: 8,
  },
  {
    id: 'q3',
    question: 'Token down 50%. You…',
    optionA: 'Buy more. It\'s on sale.',
    optionB: 'Sell everything immediately.',
    traitAffected: 'emotionalStability',
    weightA: 8,
    weightB: -8,
  },
  {
    id: 'q4',
    question: 'Your CT feed says "BUY NOW." You…',
    optionA: 'Do my own research first',
    optionB: 'Already bought it',
    traitAffected: 'memeExposure',
    weightA: -5,
    weightB: 8,
  },
  {
    id: 'q5',
    question: 'How long do you hold?',
    optionA: 'Months to years',
    optionB: 'Minutes to hours',
    traitAffected: 'patience',
    weightA: 8,
    weightB: -8,
  },
];

export const analysisMessages: AnalysisMessage[] = [
  { text: 'Connecting to Solana mainnet...', icon: '🔗', delay: 0 },
  { text: 'Scanning transaction history...', icon: '📡', delay: 1500 },
  { text: 'Analyzing risk appetite...', icon: '🎯', delay: 3000 },
  { text: 'Decoding trading impulses...', icon: '🧠', delay: 4500 },
  { text: 'Detecting emotional volatility...', icon: '💓', delay: 6000 },
  { text: 'Scanning meme coin exposure...', icon: '🐸', delay: 7500 },
  { text: 'Evaluating conviction strength...', icon: '💎', delay: 9000 },
  { text: 'Generating personality profile...', icon: '✨', delay: 10500 },
];
