'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { analysisMessages } from '@/lib/quiz-data';
import { getRandomArchetype } from '@/lib/archetypes';

export default function AnalysisSequence() {
  const { setPhase, setArchetype, walletData, setAnalysisProgress } = useAppStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  const finishAnalysis = useCallback(() => {
    const archetype = getRandomArchetype(walletData?.address);
    setArchetype(archetype);
    setPhase('reveal');
  }, [walletData, setArchetype, setPhase]);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 0.8;
      });
    }, 100);

    // Message cycling
    const messageTimers = analysisMessages.map((msg, i) =>
      setTimeout(() => {
        setCurrentMessageIndex(i);
        if (i === analysisMessages.length - 2) setShowInsight(true);
      }, msg.delay)
    );

    // Complete after ~12s
    const finishTimer = setTimeout(finishAnalysis, 12000);

    return () => {
      clearInterval(progressInterval);
      messageTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [finishAnalysis, setAnalysisProgress]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Scanning lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,255,0.4), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }}
          animate={{ top: ['100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </div>

      {/* Pulsating center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Radial progress */}
        <motion.div className="mb-10 flex justify-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none"
                stroke="url(#progressGradient)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
                style={{ filter: 'drop-shadow(0 0 6px rgba(124,92,255,0.5))' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold gradient-text">{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Decoding Your Personality
        </motion.h2>

        <motion.p
          className="text-text-muted text-sm mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Analyzing on-chain behavior patterns...
        </motion.p>

        {/* Messages */}
        <div className="h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              className="glass-card px-6 py-4 inline-flex items-center gap-3"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xl">{analysisMessages[currentMessageIndex]?.icon}</span>
              <span className="text-sm text-text-secondary">{analysisMessages[currentMessageIndex]?.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating insight */}
        <AnimatePresence>
          {showInsight && (
            <motion.div
              className="mt-8 glass-card px-5 py-3 inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ border: '1px solid rgba(124,92,255,0.2)' }}
            >
              <span className="text-xs text-primary">🔮 Pattern detected: Unusual conviction levels</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
