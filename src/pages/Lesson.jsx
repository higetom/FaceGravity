import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Lightbulb, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTodayLesson, lessons } from '../data/lessonData'

export default function Lesson() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  const todayLesson = getTodayLesson(state.lessons.completed)
  const totalLessons = lessons.length
  const completedCount = state.lessons.completed.length
  const currentDayNumber = completedCount + 1

  // Check if lesson requires premium
  const isPremiumLocked = todayLesson.id > 7 && !state.isPremium

  const handleComplete = () => {
    dispatch({
      type: 'COMPLETE_LESSON',
      payload: todayLesson.id
    })
    setShowSuccessAnimation(true)

    setTimeout(() => {
      navigate('/home')
    }, 1500)
  }

  const handleNavigateToPremium = () => {
    navigate('/premium')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-dark-800 rounded-lg transition flex-shrink-0"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <p className="text-dark-400 text-xs uppercase tracking-wider">今日のなぜ</p>
          </div>
          <p className="text-dark-300 text-sm font-semibold">
            Day {currentDayNumber} / {totalLessons}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isPremiumLocked ? (
            <motion.div
              key="lesson-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6 w-fit"
              >
                <div className="px-3 py-1.5 bg-brand-500/20 rounded-lg border border-brand-500/30">
                  <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                    {todayLesson.category}
                  </span>
                </div>
              </motion.div>

              {/* Lesson title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl font-bold text-white mb-6 leading-tight"
              >
                {todayLesson.title}
              </motion.h1>

              {/* Lesson content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-dark-200 text-base leading-relaxed whitespace-pre-wrap">
                  {todayLesson.content}
                </p>
              </motion.div>

              {/* Key point callout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6 mb-8 border-l-4"
                style={{ borderLeftColor: '#22c55e' }}
              >
                <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">Key Point</p>
                <p className="text-white font-semibold text-lg leading-relaxed">
                  "{todayLesson.keyPoint}"
                </p>
              </motion.div>

              {/* Spacer for responsive layout */}
              <div className="flex-1" />

              {/* Completion button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleComplete}
                className="btn-primary w-full mb-4"
              >
                理解した
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="premium-locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 mb-6 w-fit">
                <div className="px-3 py-1.5 bg-brand-500/20 rounded-lg border border-brand-500/30">
                  <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                    {todayLesson.category}
                  </span>
                </div>
              </div>

              {/* Blurred title */}
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight blur-sm opacity-50">
                {todayLesson.title}
              </h1>

              {/* Blurred content */}
              <div className="mb-8 blur-sm opacity-40">
                <p className="text-dark-200 text-base leading-relaxed">
                  {todayLesson.content.substring(0, 100)}...
                </p>
              </div>

              {/* Blurred key point */}
              <div className="glass-card p-6 mb-8 border-l-4 blur-sm opacity-40" style={{ borderLeftColor: '#22c55e' }}>
                <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">Key Point</p>
                <p className="text-white font-semibold text-lg">
                  {todayLesson.keyPoint}
                </p>
              </div>

              {/* Premium overlay */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <Lock className="w-12 h-12 text-brand-500 mx-auto" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">
                  続きを読むにはプレミアムプラン
                </h2>
                <p className="text-dark-400 text-sm mb-6">
                  高度なレッスンは<br />
                  プレミアムメンバー専用です
                </p>
                <button
                  onClick={handleNavigateToPremium}
                  className="btn-primary"
                >
                  プレミアムプランを見る
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator - bottom */}
      <div className="bg-dark-900 border-t border-dark-800 px-6 py-4">
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(totalLessons)].map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                // Could navigate to specific lesson if needed
              }}
              className={`transition-all ${
                idx < completedCount
                  ? 'w-2.5 h-2.5 bg-brand-500'
                  : idx === completedCount
                  ? 'w-3 h-3 bg-dark-400'
                  : 'w-2 h-2 bg-dark-700'
              } rounded-full`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl"
            >
              素晴らしい!
            </motion.div>

            {/* Confetti-like particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-brand-500 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 300}%`,
                  y: -100,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: i * 0.08,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
