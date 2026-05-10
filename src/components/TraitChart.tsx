'use client';

import { motion } from 'framer-motion';
import { TraitScore } from '@/lib/types';

interface TraitChartProps {
  traits: TraitScore[];
  delay?: number;
}

export default function TraitChart({ traits, delay = 0 }: TraitChartProps) {
  return (
    <div className="space-y-4">
      {traits.map((trait, i) => (
        <motion.div
          key={trait.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-text-secondary">{trait.name}</span>
            <span className="text-sm font-bold" style={{ color: trait.color }}>{trait.value}%</span>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, ${trait.color}88, ${trait.color})`,
                boxShadow: `0 0 12px ${trait.color}40`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${trait.value}%` }}
              transition={{ delay: delay + i * 0.12 + 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ delay: delay + i * 0.12 + 1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
