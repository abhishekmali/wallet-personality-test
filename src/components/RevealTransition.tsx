'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function RevealTransition() {
  const { archetype, setPhase } = useAppStore();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),   // Particles appear
      setTimeout(() => setStage(2), 1500),   // Emoji appears
      setTimeout(() => setStage(3), 2500),   // Title reveals
      setTimeout(() => setStage(4), 3500),   // Tagline
      setTimeout(() => setPhase('results'), 4500), // Go to results
    ];
    return () => timers.forEach(clearTimeout);
  }, [setPhase]);

  if (!archetype) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#070B14' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${archetype.accentColor}20 0%, transparent 70%)` }}
        animate={{
          scale: stage >= 1 ? [1, 1.5, 1.2] : 0,
          opacity: stage >= 1 ? [0, 0.8, 0.5] : 0,
        }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Particle burst */}
      {stage >= 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                background: archetype.accentColor,
                boxShadow: `0 0 6px ${archetype.accentColor}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: [1, 2, 0],
              }}
              transition={{ duration: 2, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Emoji */}
        <motion.div
          className="text-7xl sm:text-8xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={stage >= 2 ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        >
          {archetype.emoji}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: archetype.accentColor }}
          initial={{ opacity: 0, y: 30 }}
          animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {archetype.title}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-text-secondary max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={stage >= 4 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {archetype.tagline}
        </motion.p>
      </div>
    </motion.div>
  );
}
