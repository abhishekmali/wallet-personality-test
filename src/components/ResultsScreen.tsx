'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import TraitChart from './TraitChart';
import RadarChart from './RadarChart';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function ResultsScreen() {
  const { archetype, analysisResult, reset } = useAppStore();
  const shareRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!shareRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(shareRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#070B14',
      });
      const link = document.createElement('a');
      link.download = `wallet-personality-${archetype?.id || 'result'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  }, [archetype]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  if (!archetype || !analysisResult) return null;

  return (
    <motion.div
      className="min-h-screen py-12 px-4 sm:px-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${archetype.accentColor}08 0%, transparent 60%)` }} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Share Card (capturable) */}
        <div ref={shareRef}>
          {/* Hero Section */}
          <motion.div
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 pt-8"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
              style={{ background: `${archetype.accentColor}15`, border: `1px solid ${archetype.accentColor}30`, color: archetype.accentColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: archetype.accentColor }} />
              {analysisResult.mode === 'wallet' ? 'Wallet-Derived Personality' : 'Demo Personality Simulation'}
            </motion.div>

            {/* Emoji */}
            <motion.div
              className="text-6xl sm:text-7xl mb-4"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, delay: 0.3 }}
            >
              {archetype.emoji}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: archetype.accentColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {archetype.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-lg text-text-secondary italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              &ldquo;{archetype.tagline}&rdquo;
            </motion.p>
            <p className="text-xs text-text-muted mt-3">
              Confidence {analysisResult.confidence}% • {analysisResult.mode === 'wallet' ? 'Wallet signals are primary' : 'Demo quiz is primary'} • Calibration impact {Math.round(analysisResult.calibrationImpact * 100)}%
            </p>
            {analysisResult.fallbackReason && <p className="text-xs text-text-muted mt-2">{analysisResult.fallbackReason}</p>}
          </motion.div>

          {/* Description Card */}
          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="glass-card-strong p-6 sm:p-8 mb-6"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">About You</h3>
            <p className="text-text-secondary leading-relaxed text-[15px]">{archetype.description}</p>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="glass-card-strong p-6 sm:p-8 mb-6"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">Personality Radar</h3>
            <RadarChart traits={archetype.traits} accentColor={archetype.accentColor} size={280} />
          </motion.div>

          {/* Trait Bars */}
          <motion.div
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="glass-card-strong p-6 sm:p-8 mb-6"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">Trait Breakdown</h3>
            <TraitChart traits={analysisResult.traitScores} delay={0.5} />
          </motion.div>

          <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6 sm:p-8 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Onchain Behavior</h3>
            <ul className="space-y-2.5">
              {analysisResult.onchainBehavior.map((signal) => (
                <li key={signal} className="text-sm text-text-secondary">• {signal}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div custom={5} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6 sm:p-8 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Wallet Signals</h3>
            <ul className="space-y-2.5">
              {analysisResult.walletSignals.map((signal) => (
                <li key={signal} className="text-sm text-text-secondary">• {signal}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div custom={6} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6 sm:p-8 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Detected Patterns</h3>
            <ul className="space-y-2.5">
              {analysisResult.detectedPatterns.map((signal) => (
                <li key={signal} className="text-sm text-text-secondary">• {signal}</li>
              ))}
            </ul>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <motion.div custom={7} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6">
              <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" /> Strengths
              </h3>
              <ul className="space-y-2.5">
                {archetype.strengths.map((s, i) => (
                  <motion.li
                    key={s}
                    className="text-sm text-text-secondary flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <span className="text-success mt-0.5">✦</span> {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div custom={8} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6">
              <h3 className="text-sm font-semibold text-danger uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-danger" /> Weaknesses
              </h3>
              <ul className="space-y-2.5">
                {archetype.weaknesses.map((w, i) => (
                  <motion.li
                    key={w}
                    className="text-sm text-text-secondary flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <span className="text-danger mt-0.5">✦</span> {w}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Emotional Tendency */}
          <motion.div custom={9} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card-strong p-6 sm:p-8 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Emotional Trading Traits</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed mb-3">{archetype.emotionalTendency}</p>
            <ul className="space-y-2">
              {analysisResult.emotionalTraits.map((trait) => (
                <li key={trait} className="text-sm text-text-secondary">• {trait}</li>
              ))}
            </ul>
          </motion.div>

          {/* Meme Observation */}
          <motion.div
            custom={10}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="glass-card-strong p-6 sm:p-8 mb-8 relative overflow-hidden"
            style={{ border: `1px solid ${archetype.accentColor}20` }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${archetype.accentColor}40, transparent)` }} />
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: archetype.accentColor }}>
              🎯 Painfully Accurate Observation
            </h3>
            <p className="text-text-primary text-[15px] leading-relaxed font-medium italic">
              &ldquo;{archetype.memeObservation}&rdquo;
            </p>
          </motion.div>

          {/* Watermark for share */}
          <motion.div custom={11} variants={sectionVariants} initial="hidden" animate="visible" className="text-center mb-6">
            <p className="text-xs text-text-muted">walletpersonality.xyz</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            className="btn-primary flex-1"
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="download-card"
          >
            <span className="flex items-center justify-center gap-2">
              📸 Download Card
            </span>
          </motion.button>

          <motion.button
            className="btn-secondary flex-1"
            onClick={handleCopyLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="copy-link"
          >
            <span className="flex items-center justify-center gap-2">
              🔗 Copy Link
            </span>
          </motion.button>
        </motion.div>

        {/* Share to Twitter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          <motion.a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My crypto wallet personality is: ${archetype.emoji} ${archetype.title}\n\n"${archetype.tagline}"\n\nDiscover yours at walletpersonality.xyz`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="share-twitter"
          >
            𝕏 Share on Twitter
          </motion.a>
        </motion.div>

        {/* Try Again */}
        <motion.div
          className="text-center pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
            onClick={() => reset()}
            id="try-again"
          >
            ← Try another wallet
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
