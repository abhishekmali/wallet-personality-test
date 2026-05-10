import { create } from 'zustand';
import { AppPhase, Archetype, WalletData } from './types';

interface AppState {
  phase: AppPhase;
  walletData: WalletData | null;
  archetype: Archetype | null;
  quizAnswers: Record<string, 'A' | 'B'>;
  analysisProgress: number;
  isRevealing: boolean;

  // Actions
  setPhase: (phase: AppPhase) => void;
  setWalletData: (data: WalletData) => void;
  setArchetype: (archetype: Archetype) => void;
  setQuizAnswer: (questionId: string, answer: 'A' | 'B') => void;
  setAnalysisProgress: (progress: number) => void;
  setIsRevealing: (isRevealing: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'landing',
  walletData: null,
  archetype: null,
  quizAnswers: {},
  analysisProgress: 0,
  isRevealing: false,

  setPhase: (phase) => set({ phase }),
  setWalletData: (walletData) => set({ walletData }),
  setArchetype: (archetype) => set({ archetype }),
  setQuizAnswer: (questionId, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionId]: answer },
    })),
  setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),
  setIsRevealing: (isRevealing) => set({ isRevealing }),
  reset: () =>
    set({
      phase: 'landing',
      walletData: null,
      archetype: null,
      quizAnswers: {},
      analysisProgress: 0,
      isRevealing: false,
    }),
}));
