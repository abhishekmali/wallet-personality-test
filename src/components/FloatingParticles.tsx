'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function FloatingParticles({ count = 20, colors }: { count?: number; colors?: string[] }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const defaultColors = [
      'rgba(124, 92, 255, 0.15)',
      'rgba(0, 212, 255, 0.12)',
      'rgba(255, 79, 216, 0.1)',
      'rgba(124, 92, 255, 0.08)',
    ];
    const colorSet = colors || defaultColors;

    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
      color: colorSet[i % colorSet.length],
    }));

    setParticles(generated);
  }, [count, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 20, -60, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
