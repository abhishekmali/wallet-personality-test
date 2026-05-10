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
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const badgeData = [
  { label: 'Diamond Hands', emoji: '💎', color: '#818CF8' },
  { label: 'Meme Lord', emoji: '🐸', color: '#4ADE80' },
  { label: 'Panic Seller', emoji: '😱', color: '#FB7185' },
  { label: 'Midnight Trader', emoji: '🌙', color: '#A78BFA' },
  { label: 'Yield Farmer', emoji: '🌾', color: '#34D399' },
];

export default function LandingHero() {
  const setPhase = useAppStore((s) => s.setPhase);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
          Analyze your Solana wallet and discover the trader archetype hiding
          behind your transactions. It&apos;s painfully accurate.
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
            <span className="text-primary">12,847</span> wallets analyzed
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
              <motion.div
                key={badge.label}
                className="glass-card flex items-center gap-2 px-4 py-2.5 cursor-default"
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
              >
                <span className="text-lg">{badge.emoji}</span>
                <span className="text-sm font-medium text-text-secondary">{badge.label}</span>
              </motion.div>
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
