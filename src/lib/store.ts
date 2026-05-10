import { create } from 'zustand';
import { AnalysisMode, AnalysisResult, AppPhase, Archetype, WalletData } from './types';

interface AppState {
  phase: AppPhase;
  mode: AnalysisMode;
  walletData: WalletData | null;
  archetype: Archetype | null;
  analysisResult: AnalysisResult | null;
  quizAnswers: Record<string, 'A' | 'B'>;
  analysisProgress: number;
  isRevealing: boolean;

  // Actions
  setPhase: (phase: AppPhase) => void;
  setMode: (mode: AnalysisMode) => void;
  setWalletData: (data: WalletData) => void;
  setArchetype: (archetype: Archetype) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setQuizAnswer: (questionId: string, answer: 'A' | 'B') => void;
  setAnalysisProgress: (progress: number) => void;
  setIsRevealing: (isRevealing: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'landing',
  mode: 'wallet',
  walletData: null,
  archetype: null,
  analysisResult: null,
  quizAnswers: {},
  analysisProgress: 0,
  isRevealing: false,

  setPhase: (phase) => set({ phase }),
  setMode: (mode) => set({ mode }),
  setWalletData: (walletData) => set({ walletData }),
  setArchetype: (archetype) => set({ archetype }),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  setQuizAnswer: (questionId, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionId]: answer },
    })),
  setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),
  setIsRevealing: (isRevealing) => set({ isRevealing }),
  reset: () =>
    set({
      phase: 'landing',
      mode: 'wallet',
      walletData: null,
      archetype: null,
      analysisResult: null,
      quizAnswers: {},
      analysisProgress: 0,
      isRevealing: false,
    }),
}));
