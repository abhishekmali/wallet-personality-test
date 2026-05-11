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
  scanCount: number;

  // Actions
  setPhase: (phase: AppPhase) => void;
  setMode: (mode: AnalysisMode) => void;
  setWalletData: (data: WalletData) => void;
  setArchetype: (archetype: Archetype) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setQuizAnswer: (questionId: string, answer: 'A' | 'B') => void;
  setAnalysisProgress: (progress: number) => void;
  setIsRevealing: (isRevealing: boolean) => void;
  incrementScanCount: () => void;
  reset: () => void;
}

const LAUNCH_DATE_MS = new Date('2026-05-11T00:00:00Z').getTime();
const INITIAL_BASE_COUNT = 50;

function getSharedScanCount() {
  const hoursSinceLaunch = Math.floor((Date.now() - LAUNCH_DATE_MS) / (1000 * 60 * 60));
  return INITIAL_BASE_COUNT + Math.max(0, hoursSinceLaunch);
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
  scanCount: typeof window !== 'undefined' 
    ? getSharedScanCount() + (Number(localStorage.getItem('wp_local_scans')) || 0)
    : getSharedScanCount(),

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
  incrementScanCount: () => set((state) => {
    const localScans = (Number(localStorage.getItem('wp_local_scans')) || 0) + 1;
    localStorage.setItem('wp_local_scans', localScans.toString());
    return { scanCount: state.scanCount + 1 };
  }),
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
