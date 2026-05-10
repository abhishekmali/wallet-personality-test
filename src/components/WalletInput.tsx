'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function WalletInput() {
  const { setPhase, setWalletData, setMode } = useAppStore();
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const isValidSolanaAddress = (addr: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim());

  const handleSubmit = () => {
    const trimmed = address.trim();
    if (!trimmed) { setError('Please enter a wallet address'); return; }
    if (!isValidSolanaAddress(trimmed)) { setError("That doesn't look like a valid Solana address"); return; }
    setError('');
    setMode('wallet');
    setWalletData({ address: trimmed });
    setPhase('quiz');
  };

  const handleDemoMode = () => {
    setMode('demo');
    setWalletData({ address: 'DYw8jCTfBox68YP6bXzNRCqoLdR4UwgCq36zTFt8VJwZ' });
    setPhase('quiz');
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center px-6 relative" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="relative z-10 w-full max-w-lg">
        <motion.button variants={itemVariants} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8 group" onClick={() => setPhase('landing')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </motion.button>

        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Enter your wallet</h2>
          <p className="text-text-secondary text-lg">We analyze real Solana activity first, then ask a few calibration questions.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative">
            {isFocused && (
              <motion.div className="absolute -inset-[1px] rounded-[17px] pointer-events-none" style={{ background: 'linear-gradient(135deg, #7C5CFF, #00D4FF, #FF4FD8)', opacity: 0.4 }} initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} />
            )}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M2 10h20" /></svg>
              </div>
              <input id="wallet-input" type="text" value={address} onChange={(e) => { setAddress(e.target.value); setError(''); }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="Paste Solana wallet address..." className="input-futuristic pl-14 pr-5" autoComplete="off" spellCheck={false} />
            </div>
          </div>
          {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-danger text-sm mt-3">⚠️ {error}</motion.p>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button className="btn-primary w-full text-base" onClick={handleSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="submit-wallet">
            <span className="flex items-center justify-center gap-2">🔍 Begin Analysis</span>
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border" /><span className="text-sm text-text-muted">or</span><div className="flex-1 h-px bg-border" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button className="btn-secondary w-full text-base" onClick={handleDemoMode} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="demo-mode">
            <span>✨ Try Demo Mode (Simulated Wallet)</span>
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-text-muted mt-4">
          Demo mode uses simulated wallet behavior for fast previews.
        </motion.p>

        <motion.p variants={itemVariants} className="text-center text-xs text-text-muted mt-8">
          🔒 Read-only analysis. We never request signing permissions.
        </motion.p>
      </div>
    </motion.div>
  );
}
