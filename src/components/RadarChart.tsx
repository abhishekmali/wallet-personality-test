'use client';

import { motion } from 'framer-motion';
import { TraitScore } from '@/lib/types';

interface RadarChartProps {
  traits: TraitScore[];
  size?: number;
  accentColor: string;
}

export default function RadarChart({ traits, size = 250, accentColor }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 4;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = traits.map((t, i) => getPoint(i, t.value));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <motion.div
      className="chart-container flex justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid levels */}
        {Array.from({ length: levels }).map((_, level) => {
          const r = radius * ((level + 1) / levels);
          const gridPoints = traits.map((_, i) => {
            const angle = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          });
          return (
            <polygon
              key={level}
              points={gridPoints.join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {traits.map((_, i) => {
          const angle = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data area */}
        <motion.path
          d={pathData}
          fill={`${accentColor}15`}
          stroke={accentColor}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${accentColor}40)` }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={accentColor}
            stroke="#070B14"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
            style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }}
          />
        ))}

        {/* Labels */}
        {traits.map((t, i) => {
          const angle = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
          const labelR = radius + 28;
          const x = center + labelR * Math.cos(angle);
          const y = center + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94A3B8"
              fontSize="10"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {t.name}
            </text>
          );
        })}
      </svg>
    </motion.div>
  );
}
