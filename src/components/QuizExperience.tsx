'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { quizQuestions } from '@/lib/quiz-data';

export default function QuizExperience() {
  const { setPhase, setQuizAnswer, quizAnswers } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const question = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

  const handleSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setQuizAnswer(question.id, option);

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setPhase('analyzing');
      }
    }, 600);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">Question {currentIndex + 1} of {quizQuestions.length}</span>
            <span className="text-sm text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7C5CFF, #00D4FF)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              {question.question}
            </h2>

            <div className="space-y-4">
              {/* Option A */}
              <motion.button
                className="w-full text-left"
                onClick={() => handleSelect('A')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id={`quiz-option-a-${question.id}`}
              >
                <div
                  className="glass-card px-6 py-5 transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor: selectedOption === 'A' ? '#7C5CFF' : undefined,
                    boxShadow: selectedOption === 'A' ? '0 0 30px rgba(124,92,255,0.2)' : undefined,
                    background: selectedOption === 'A' ? 'rgba(124,92,255,0.12)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: selectedOption === 'A' ? 'linear-gradient(135deg, #7C5CFF, #00D4FF)' : 'rgba(255,255,255,0.06)',
                        color: selectedOption === 'A' ? 'white' : '#94A3B8',
                      }}
                    >
                      A
                    </div>
                    <span className="text-lg font-medium text-text-primary">{question.optionA}</span>
                  </div>
                </div>
              </motion.button>

              {/* Option B */}
              <motion.button
                className="w-full text-left"
                onClick={() => handleSelect('B')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id={`quiz-option-b-${question.id}`}
              >
                <div
                  className="glass-card px-6 py-5 transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor: selectedOption === 'B' ? '#FF4FD8' : undefined,
                    boxShadow: selectedOption === 'B' ? '0 0 30px rgba(255,79,216,0.2)' : undefined,
                    background: selectedOption === 'B' ? 'rgba(255,79,216,0.12)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: selectedOption === 'B' ? 'linear-gradient(135deg, #FF4FD8, #A855F7)' : 'rgba(255,255,255,0.06)',
                        color: selectedOption === 'B' ? 'white' : '#94A3B8',
                      }}
                    >
                      B
                    </div>
                    <span className="text-lg font-medium text-text-primary">{question.optionB}</span>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip hint */}
        <motion.p
          className="text-center text-xs text-text-muted mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Your answers personalize the result 🎯
        </motion.p>
      </div>
    </motion.div>
  );
}
