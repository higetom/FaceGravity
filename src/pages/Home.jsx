import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lightbulb, Lock, Flame, Check, Moon, Dumbbell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTodayProgram } from '../data/trainingData'
import { getTodayLesson } from '../data/lessonData'

export default function Home() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [greeting, setGreeting] = useState('')
  const [todayDate, setTodayDate] = useState('')
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    'リンパ管は皮膚表面0.5mmにあります。軽い圧で十分です。',
    '前傾姿勢は広頸筋を短縮させ、顔を下げる力を増大させます。',
    '表情筋を鍛えると皮膚の下の「詰め物」が増えて、顔がふっくらします。',
    '強いマッサージは靭帯の伸展を招きます。2-3gの軽圧が効果的です。',
    '深頸屈筋群の再活性化が姿勢改善のマスターキーです。',
    '骨に付着しない広頸筋が、顔を直接引き下げます。',
  ]

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 12) {
      setGreeting('おはようございます')
    } else if (hour < 18) {
      setGreeting('こんにちは')
    } else {
      setGreeting('こんばんは')
    }

    const options = {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }
    const dateStr = now.toLocaleDateString('ja-JP', options)
    setTodayDate(dateStr)

    setCurrentTip(Math.floor(Math.random() * tips.length))
  }, [])

  const todayProgram = getTodayProgram(state.diagnosis)
  const todayLesson = getTodayLesson(state.lessons.completed)
  const isRestDay = !todayProgram
  const isDayCompleted = state.training.todayCompleted.length > 0

  const diagnosis = state.diagnosis
  const cmaGrade = diagnosis.cmaGrade || '-'
  const jdi = diagnosis.jdi || '-'
  const postureGrade = diagnosis.postureGrade || '-'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      className="mobile-container bg-dark-950 safe-bottom"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="page-padding">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            {greeting}、{state.user.name || 'User'}さん
          </h1>
          <p className="text-slate-400 text-sm">{todayDate}</p>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-6 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-bold gradient-text">{state.streak.current}</div>
              <div className="text-white/70 text-sm">
                <div>日連続</div>
                <div className="text-xs text-white/50 mt-1">
                  最高記録: {state.streak.longest}日
                </div>
              </div>
            </div>
            <Flame size={36} className="text-orange-400" />
          </div>

          {/* Weekly Progress Dots */}
          <div className="mb-6">
            <div className="flex gap-2 justify-between">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx < state.training.weeklyDone
                        ? 'bg-green-500 scale-125'
                        : 'bg-white/10'
                    }`}
                  />
                  <span className="text-xs text-white/50">{day.slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="text-sm text-white/80 font-medium">
            {isDayCompleted ? (
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                今日は完了済み！
              </div>
            ) : (
              <div>今日のトレーニングを完了しよう</div>
            )}
          </div>
        </motion.div>

        {/* Today's Scores Summary */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-6 cursor-pointer hover:border-white/20 transition-colors"
          onClick={() => navigate('/progress')}
        >
          <h3 className="text-white/80 text-sm font-semibold mb-4">スコアサマリー</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* CMA Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold text-white">{cmaGrade}</div>
              <div className="text-xs text-white/60">顎下ライン角度</div>
            </div>

            {/* JDI Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold text-white">
                {typeof jdi === 'number' ? jdi : '-'}
                {typeof jdi === 'number' && <span className="text-sm">/100</span>}
              </div>
              <div className="text-xs text-white/60">フェイスライン</div>
            </div>

            {/* Posture Grade */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold text-white">{postureGrade}</div>
              <div className="text-xs text-white/60">姿勢</div>
            </div>
          </div>
        </motion.div>

        {/* Today's Program Card */}
        {isRestDay ? (
          <motion.div variants={itemVariants} className="glass-card p-6 mb-6">
            <div className="flex items-start gap-4">
              <Moon size={32} className="text-blue-300" />
              <div>
                <h3 className="text-white font-bold mb-2">今日は回復日です</h3>
                <p className="text-white/70 text-sm">身体を休めましょう。明日からまた頑張ります！</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-sm mb-1">
                  今日のプログラム
                  {todayProgram.isPersonalized && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium align-middle">
                      あなた専用
                    </span>
                  )}
                </h3>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{
                    backgroundColor: todayProgram.category.color + '33',
                    color: todayProgram.category.color,
                  }}
                >
                  {todayProgram.category.title}
                </div>
              </div>
              <Dumbbell size={22} className="text-green-400" />
            </div>

            <div className="space-y-2 mb-6">
              {todayProgram.exercises.map((exercise) => (
                <div key={exercise.id} className="flex justify-between items-center text-sm">
                  <span className="text-white/80">{exercise.name}</span>
                  <span className="text-white/50">{exercise.duration}秒</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/training')}
              className="btn-primary"
            >
              トレーニングを始める
            </button>
          </motion.div>
        )}

        {/* Today's Lesson Preview */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-6 cursor-pointer hover:border-white/20 transition-colors"
          onClick={() => navigate('/lesson')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="text-xs font-semibold text-white/60">今日のなぜ</span>
              </div>
              <h3 className="text-white font-bold text-base leading-tight">
                {todayLesson.title}
              </h3>
              <p className="text-white/60 text-xs mt-2">{todayLesson.category}</p>
            </div>
            {todayLesson.id > 7 && !state.isPremium && (
              <Lock size={20} className="text-white/40 flex-shrink-0 ml-2" />
            )}
          </div>
        </motion.div>

        {/* Quick Tips Card */}
        <motion.div variants={itemVariants} className="glass-card p-6 mb-6">
          <h3 className="text-white/80 text-sm font-semibold mb-3">今日の豆知識</h3>
          <div className="flex items-start gap-3">
            <Lightbulb size={22} className="text-yellow-400 flex-shrink-0" />
            <p className="text-white/80 text-sm leading-relaxed">{tips[currentTip]}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
