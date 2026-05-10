'use client';

import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import LandingHero from '@/components/LandingHero';
import WalletInput from '@/components/WalletInput';
import QuizExperience from '@/components/QuizExperience';
import AnalysisSequence from '@/components/AnalysisSequence';
import RevealTransition from '@/components/RevealTransition';
import ResultsScreen from '@/components/ResultsScreen';

export default function Home() {
  const phase = useAppStore((s) => s.phase);

  return (
    <main className="flex-1 relative">
      <AnimatePresence mode="wait">
        {phase === 'landing' && <LandingHero key="landing" />}
        {phase === 'input' && <WalletInput key="input" />}
        {phase === 'quiz' && <QuizExperience key="quiz" />}
        {phase === 'analyzing' && <AnalysisSequence key="analyzing" />}
        {phase === 'reveal' && <RevealTransition key="reveal" />}
        {phase === 'results' && <ResultsScreen key="results" />}
      </AnimatePresence>
    </main>
  );
}
