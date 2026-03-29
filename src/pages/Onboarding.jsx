import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [step, setStep] = useState(0)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    concern: '',
    deskHours: '',
  })

  const ageOptions = ['20s', '30s', '40s', '50s', '60s+']
  const genderOptions = ['Male', 'Female', 'Other']
  const concernOptions = [
    'ほうれい線',
    'ジョウル',
    '二重顎',
    '首のシワ',
    '全体的なたるみ',
  ]
  const deskHoursOptions = ['1-3h', '3-6h', '6-9h', '9h+']

  const isStep0Valid = formData.name.trim() && formData.age
  const isStep1Valid = formData.gender && formData.concern
  const isStep2Valid = formData.deskHours

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit and navigate
      dispatch({
        type: 'SET_USER',
        payload: formData,
      })
      navigate('/diagnosis')
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const canProceed = [isStep0Valid, isStep1Valid, isStep2Valid, true][step]

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  const pageTransition = {
    duration: 0.4,
    ease: 'easeInOut',
  }

  return (
    <div className="mobile-container bg-dark-950 flex flex-col overflow-hidden">
      {/* Header with Progress */}
      <div className="page-padding flex flex-col gap-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">セットアップ</h1>
          <span className="text-sm text-white/50">
            {step + 1} / 4
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === step ? 1.2 : 1,
                backgroundColor: i <= step ? '#22c55e' : 'rgba(255,255,255,0.1)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === step ? 32 : 24 }}
            />
          ))}
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto page-padding">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={pageTransition}
              className="flex flex-col gap-6 pb-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  まず、あなたのことを教えてください
                </h2>
                <p className="text-white/60">
                  お名前と年齢を選択してください
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white/80">
                  お名前
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例: 田中太郎"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Age Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white/80">
                  年代
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ageOptions.map((age) => (
                    <motion.button
                      key={age}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData({ ...formData, age })
                      }
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        formData.age === age
                          ? 'gradient-brand text-white shadow-lg shadow-emerald-400/30'
                          : 'glass-card text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {age}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={pageTransition}
              className="flex flex-col gap-6 pb-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  性別と主な悩みは?
                </h2>
                <p className="text-white/60">
                  あなたにぴったりなプログラムを作成します
                </p>
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white/80">
                  性別
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map((gender) => (
                    <motion.button
                      key={gender}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData({ ...formData, gender })
                      }
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        formData.gender === gender
                          ? 'gradient-brand text-white shadow-lg shadow-emerald-400/30'
                          : 'glass-card text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {gender}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Concern Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white/80">
                  主な悩み
                </label>
                <div className="space-y-2">
                  {concernOptions.map((concern) => (
                    <motion.button
                      key={concern}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        setFormData({ ...formData, concern })
                      }
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-left ${
                        formData.concern === concern
                          ? 'gradient-brand text-white shadow-lg shadow-emerald-400/30'
                          : 'glass-card text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {concern}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={pageTransition}
              className="flex flex-col gap-6 pb-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  1日のデスク時間は?
                </h2>
                <p className="text-white/60">
                  より正確な診断のためお教えください
                </p>
              </div>

              {/* Desk Hours Selection */}
              <div className="space-y-3">
                <div className="space-y-3">
                  {deskHoursOptions.map((hours) => (
                    <motion.button
                      key={hours}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        setFormData({ ...formData, deskHours: hours })
                      }
                      className={`w-full py-4 px-4 rounded-xl font-semibold transition-all duration-300 text-left flex items-center justify-between ${
                        formData.deskHours === hours
                          ? 'gradient-brand text-white shadow-lg shadow-emerald-400/30'
                          : 'glass-card text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span>{hours}</span>
                      {formData.deskHours === hours && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="glass-card p-4 mt-4">
                <p className="text-sm text-white/70 leading-relaxed">
                  デスク作業の時間が長いほど、姿勢の影響が大きくなります。
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={pageTransition}
              className="flex flex-col gap-6 pb-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  準備完了!
                </h2>
                <p className="text-white/60 text-lg mb-8">
                  あなたに最適なプログラムを
                  <br />
                  作成します
                </p>
              </div>

              {/* Summary Card */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">お名前</span>
                  <span className="text-white font-semibold">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">年代</span>
                  <span className="text-white font-semibold">{formData.age}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">性別</span>
                  <span className="text-white font-semibold">{formData.gender}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">悩み</span>
                  <span className="text-white font-semibold text-right">
                    {formData.concern}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">デスク時間</span>
                  <span className="text-white font-semibold">
                    {formData.deskHours}
                  </span>
                </div>
              </div>

              {/* Motivation Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-white/80 text-sm leading-relaxed"
              >
                <p>
                  正しい姿勢を習慣づけることで、
                  <br />
                  3週間で効果を感じることができます。
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with Navigation Buttons */}
      <div className="page-padding flex-shrink-0 flex gap-3 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrev}
          disabled={step === 0}
          className="flex-1 py-4 rounded-2xl font-bold text-white/80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 border border-white/20"
        >
          <div className="flex items-center justify-center gap-2">
            <ChevronLeft size={20} />
            <span>戻る</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: canProceed ? 1.02 : 1 }}
          whileTap={{ scale: canProceed ? 0.98 : 1 }}
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            canProceed
              ? 'btn-primary text-white'
              : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
          }`}
        >
          <span>{step === 3 ? '開始' : '次へ'}</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}
