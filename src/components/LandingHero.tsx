'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import FloatingParticles from './FloatingParticles';
import { useCallback, useEffect, useRef, useState } from 'react';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const badgeData = [
  { label: 'Diamond Hands', emoji: '💎', color: '#818CF8', tooltip: 'High-conviction holders who never sell the dip.' },
  { label: 'Meme Lord', emoji: '🐸', color: '#4ADE80', tooltip: 'The first to spot the next viral token.' },
  { label: 'Panic Seller', emoji: '😱', color: '#FB7185', tooltip: 'Quick fingers, faster sells. Emotional trading specialist.' },
  { label: 'Midnight Trader', emoji: '🌙', color: '#A78BFA', tooltip: 'Active when the world sleeps. Night-owl liquidity.' },
  { label: 'Yield Farmer', emoji: '🌾', color: '#34D399', tooltip: 'Passive income master, chasing the best APYs.' },
];

export default function LandingHero() {
  const setPhase = useAppStore((s) => s.setPhase);
  const scanCount = useAppStore((s) => s.scanCount);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <FloatingParticles count={15} />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,92,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(124, 92, 255, 0.12)',
              border: '1px solid rgba(124, 92, 255, 0.25)',
              color: '#9B80FF',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Powered by Solana Blockchain
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <span className="block text-text-primary">Your wallet has</span>
          <span className="block gradient-text">a personality.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Run two distinct paths: real wallet analysis powered by onchain behavior,
          or a fast demo mode with simulated signals for quick previews.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            className="btn-primary text-lg px-10 py-5 rounded-2xl"
            onClick={() => setPhase('input')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="analyze-cta"
          >
            <span className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9M21 12a9 9 0 0 1-9 9M21 12H3M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18" />
              </svg>
              Analyze My Wallet
            </span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-text-muted"
        >
          <div className="flex items-center gap-2">
            <motion.span 
              key={scanCount}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="text-primary font-bold text-base"
            >
              {scanCount.toLocaleString()}
            </motion.span> 
            wallets analyzed
          </div>
          <div className="w-1 h-1 rounded-full bg-text-muted" />
          <div className="flex items-center gap-2">
            <span className="text-secondary">10</span> archetypes
          </div>
          <div className="w-1 h-1 rounded-full bg-text-muted" />
          <div className="flex items-center gap-2">
            <span className="text-tertiary">Free</span> forever
          </div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          <AnimatePresence>
            {badgeData.map((badge, i) => (
              <div key={badge.label} className="relative">
                <motion.div
                  className="glass-card flex items-center gap-2 px-4 py-2.5 cursor-default relative overflow-hidden"
                  style={{
                    border: `1px solid ${badge.color}22`,
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: [0, -4, 0],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { delay: 1.2 + i * 0.15, duration: 0.5 },
                    y: {
                      delay: 1.2 + i * 0.15,
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: { delay: 1.2 + i * 0.15, duration: 0.5 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 20px ${badge.color}33`,
                    borderColor: `${badge.color}44`,
                  }}
                  onHoverStart={() => setHoveredBadge(badge.label)}
                  onHoverEnd={() => setHoveredBadge(null)}
                >
                  <span className="text-lg">{badge.emoji}</span>
                  <span className="text-sm font-medium text-text-secondary">{badge.label}</span>
                  
                  {/* Subtle hover glow effect */}
                  {hoveredBadge === badge.label && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${badge.color}11 0%, transparent 70%)` }}
                    />
                  )}
                </motion.div>

                <AnimatePresence>
                  {hoveredBadge === badge.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 p-4 z-50 pointer-events-none"
                    >
                      <div 
                        className="relative p-3 rounded-xl border shadow-2xl"
                        style={{ 
                          backgroundColor: '#0A0F1C',
                          borderColor: `${badge.color}66`,
                          boxShadow: `0 10px 40px -10px ${badge.color}66`
                        }}
                      >
                        <div className="font-bold text-[10px] uppercase tracking-widest mb-1.5" style={{ color: badge.color }}>
                          {badge.label}
                        </div>
                        <div className="text-[12px] text-[#F1F5F9] leading-relaxed font-medium">
                          {badge.tooltip}
                        </div>
                        {/* Tip triangle */}
                        <div 
                          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
                          style={{ borderTopColor: '#0A0F1C' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity } }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
