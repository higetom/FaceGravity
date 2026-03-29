import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, Zap, BedDouble, Volume2, VolumeX, Flame, TrendingUp, Award, Share2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTodayProgram, trainingCategories } from '../data/trainingData'
import { getTodayLesson } from '../data/lessonData'
import ExerciseIllustration from '../components/ExerciseIllustration'

export default function Training() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const program = getTodayProgram(state.diagnosis)

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [expandedScience, setExpandedScience] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const lastSpokenRef = useRef('')

  // Voice guidance using Web Speech API
  const speak = useCallback((text) => {
    if (!voiceEnabled) return
    if (!window.speechSynthesis) return
    // Don't repeat the same message
    if (lastSpokenRef.current === text) return
    lastSpokenRef.current = text

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 0.8
    // Try to use a Japanese voice
    const voices = window.speechSynthesis.getVoices()
    const jaVoice = voices.find(v => v.lang.startsWith('ja'))
    if (jaVoice) utterance.voice = jaVoice
    window.speechSynthesis.speak(utterance)
  }, [voiceEnabled])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  // Rest day check
  const isRestDay = !program

  // Exercise data
  const exercises = program?.exercises || []
  const currentExercise = exercises[currentExerciseIndex]
  const category = program?.category

  // Announce exercise name when it changes
  useEffect(() => {
    if (currentExercise && isRunning) {
      lastSpokenRef.current = '' // reset so we can speak
      speak(`${currentExercise.name}。${currentExercise.steps[0] || ''}`)
    }
  }, [currentExerciseIndex])

  // Timer effect with voice cues
  useEffect(() => {
    if (!isRunning || !currentExercise) return

    const timer = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1
        const remaining = currentExercise.duration - next

        // Voice cues at key moments
        if (remaining === 10) speak('あと10秒')
        if (remaining === 5) speak('あと5秒')
        if (remaining === 3) speak('3')
        if (remaining === 2) speak('2')
        if (remaining === 1) speak('1')

        if (next >= currentExercise.duration) {
          setIsRunning(false)
          if (currentExerciseIndex < exercises.length - 1) {
            speak('はい、次のエクササイズへ')
          } else {
            speak('お疲れ様でした。トレーニング完了です')
          }
          setTimeout(() => {
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1)
              setCurrentTime(0)
            } else {
              setIsCompleted(true)
            }
          }, 800)
          return currentExercise.duration
        }

        // Halfway point guidance
        if (next === Math.floor(currentExercise.duration / 2)) {
          speak('半分です。そのまま維持してください')
        }

        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, currentExercise, currentExerciseIndex, exercises.length, speak])

  // Handle completion
  const handleComplete = () => {
    dispatch({
      type: 'COMPLETE_TRAINING',
      payload: category.id
    })
    // Show completion screen, then navigate after a moment
  }

  const handleSkip = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentTime(0)
      setIsRunning(false)
    } else {
      setIsCompleted(true)
    }
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100

  // Rest day screen
  if (isRestDay) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6 py-8">
        <button
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 p-2 hover:bg-dark-900 rounded-lg transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <BedDouble className="w-16 h-16 text-blue-300 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">回復日です</h1>
          <p className="text-dark-300 text-lg mb-8">
            筋肉の成長は休息の時に起こります。<br />
            今日は十分な睡眠と栄養補給をお心がけください。
          </p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            ホームに戻る
          </button>
        </motion.div>
      </div>
    )
  }

  // Completion screen
  if (isCompleted) {
    const todayLesson = getTodayLesson(state.lessons.completed)
    const totalSeconds = exercises.reduce((sum, ex) => sum + ex.duration, 0)
    const totalMinutes = Math.ceil(totalSeconds / 60)
    const streak = (state.streak?.current || 0) + 1
    const totalSessions = (state.weeklyStats?.sessionsCompleted || 0) + 1

    // Predicted improvement based on category
    const predictions = {
      elevation: { metric: 'フェイスライン', change: '+0.5〜1.0pt/週', icon: TrendingUp },
      release: { metric: 'ネックライン角度', change: '-0.5〜1.0°/週', icon: TrendingUp },
      posture: { metric: '姿勢角度', change: '-1.0〜2.0°/週', icon: TrendingUp },
    }
    const prediction = predictions[category?.id] || predictions.elevation

    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center px-6 py-8 relative overflow-hidden">
        {/* Celebration particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              background: ['#22c55e', '#2dd4bf', '#60a5fa', '#fbbf24'][i % 4],
            }}
            initial={{ x: '50vw', y: '40vh', opacity: 1, scale: 0 }}
            animate={{
              x: `${10 + Math.random() * 80}vw`,
              y: `${-10 + Math.random() * 30}vh`,
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
            }}
            transition={{ duration: 1.8 + Math.random() * 0.8, delay: i * 0.06, ease: 'easeOut' }}
          />
        ))}

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }} className="w-full max-w-sm text-center">

          {/* Success icon */}
          <motion.div animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.8, delay: 0.1 }} className="mb-4">
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(45,212,191,0.2))', border: '2px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-1">トレーニング完了!</h1>
          <p className="text-white/50 text-sm mb-6">{category?.title}</p>

          {/* Stats cards */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: '時間', value: `${totalMinutes}分`, color: '#22c55e' },
              { label: '種目', value: `${exercises.length}個`, color: '#2dd4bf' },
              { label: '連続', value: `${streak}日`, color: '#fb923c' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Streak milestone */}
          {streak >= 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3 p-4 rounded-2xl mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,179,8,0.1))', border: '1px solid rgba(249,115,22,0.2)' }}>
              <Award className="w-8 h-8 text-orange-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  {streak >= 30 ? '1ヶ月達成!' : streak >= 14 ? '2週間達成!' : streak >= 7 ? '1週間達成!' : `${streak}日連続!`}
                </p>
                <p className="text-white/50 text-xs">
                  {streak >= 14 ? '効果が目に見え始める時期です' : streak >= 7 ? '習慣化が始まっています' : '3日坊主を突破しました'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Predicted improvement */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="text-white/60 text-xs font-medium">このペースで続けると...</p>
            </div>
            <p className="text-white font-semibold text-sm">
              {prediction.metric}: <span className="text-green-400">{prediction.change}</span> の改善が期待できます
            </p>
            <p className="text-white/40 text-xs mt-1">4〜8週間の継続で効果が実感できる水準です</p>
          </motion.div>

          {/* Today's lesson teaser */}
          {todayLesson && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/10 text-left">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">今日の知識</p>
              <p className="text-white font-semibold text-sm line-clamp-2">{todayLesson.title}</p>
              <button onClick={() => navigate('/lesson')}
                className="mt-3 w-full bg-green-500/15 hover:bg-green-500/25 text-green-400 text-sm py-2.5 rounded-xl transition font-medium">
                学んでみる
              </button>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="space-y-3">
            <button onClick={() => { handleComplete(); navigate('/home') }}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
              ホームに戻る
            </button>
            <button onClick={() => { handleComplete(); navigate('/progress') }}
              className="w-full py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white/70 font-medium text-sm">
              経過を確認する
            </button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Main training screen
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-dark-800 rounded-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-dark-400 text-xs uppercase tracking-wider">今日のトレーニング</p>
            <h1 className="text-xl font-bold text-white">{category.title}</h1>
          </div>
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); window.speechSynthesis?.cancel() }}
            className={`p-2.5 rounded-xl transition ${voiceEnabled ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'}`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-dark-400">
            <span>進捗</span>
            <span>{currentExerciseIndex + 1} / {exercises.length}</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Exercise content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col"
          >
            {/* Exercise illustration */}
            <div className="mb-4">
              <ExerciseIllustration exercise={currentExercise} size="md" />
            </div>

            {/* Exercise name and target */}
            <div className="mb-8">
              <div
                className="inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-3 text-white"
                style={{ backgroundColor: category.colorLight }}
              >
                {currentExercise.target}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentExercise.name}
              </h2>
              <p className="text-dark-400">
                {currentExercise.description}
              </p>
            </div>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">
                ステップ
              </h3>
              <ol className="space-y-3">
                {currentExercise.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-dark-800 text-xs font-bold text-brand-500">
                      {idx + 1}
                    </span>
                    <span className="text-dark-200 text-sm mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Timer circle */}
            <div className="flex justify-center mb-10">
              <div className="relative w-48 h-48">
                <svg
                  className="absolute inset-0 w-full h-full transform -rotate-90"
                  viewBox="0 0 200 200"
                >
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-dark-800"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 90}
                    initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 90 * (1 - currentTime / currentExercise.duration),
                    }}
                    transition={{ type: 'linear' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={Math.floor(currentTime)}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl font-bold text-brand-500"
                  >
                    {currentExercise.duration - currentTime}
                  </motion.div>
                  <p className="text-dark-400 text-xs mt-1">秒</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  const next = !isRunning
                  setIsRunning(next)
                  if (next && currentTime === 0) {
                    lastSpokenRef.current = ''
                    speak(`${currentExercise.name}、スタート`)
                  }
                }}
                className="flex-1 btn-primary"
              >
                {isRunning ? '一時停止' : 'スタート'}
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 bg-dark-800 hover:bg-dark-700 text-white font-semibold py-3 rounded-lg transition"
              >
                スキップ
              </button>
            </div>

            {/* Science section */}
            <motion.div
              className="bg-dark-900 rounded-lg overflow-hidden border border-dark-800"
              layout
            >
              <button
                onClick={() => setExpandedScience(!expandedScience)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-800 transition"
              >
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-500" />
                  なぜこのエクササイズ？
                </span>
                <motion.div
                  animate={{ rotate: expandedScience ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedScience && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-3 border-t border-dark-800 bg-dark-950"
                  >
                    <p className="text-dark-300 text-sm leading-relaxed">
                      {currentExercise.science}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
