import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X,
  BarChart3,
  Dumbbell,
  Brain,
  BookOpen,
  Shield,
  Star,
  Check,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Premium() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const handleSubscribe = () => {
    dispatch({ type: 'SET_PREMIUM', payload: true })
    navigate('/home')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const features = [
    {
      icon: BarChart3,
      title: '週次スキャン比較',
      description:
        'AIが微細な変化を検出し、Before/Afterで可視化',
    },
    {
      icon: Dumbbell,
      title: '全トレーニングメニュー',
      description:
        '12種目のフルプログラム + パーソナルメニュー',
    },
    {
      icon: Brain,
      title: '因果関係分析',
      description:
        '姿勢→顔の変化の科学的レポート',
    },
    {
      icon: BookOpen,
      title: '1日1分レッスン全アーカイブ',
      description:
        '解剖学の知識で納得しながら継続',
    },
    {
      icon: Shield,
      title: 'ストリーク凍結',
      description:
        '月2回まで連続記録を保護',
    },
  ]

  return (
    <motion.div
      className="mobile-container bg-dark-950 safe-bottom"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Close Button */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="page-padding pt-16">
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="text-4xl font-black text-white mb-2 leading-tight">
            あなたの変化を、
          </h1>
          <h1 className="text-4xl font-black mb-4 leading-tight">
            <span className="gradient-text">見逃さない。</span>
          </h1>
          <p className="text-white/70 text-base">FaceGravity Premium</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="mb-12 space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-4 flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Pricing Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4 text-center">
            シンプルな料金
          </h2>

          <div className="space-y-3">
            {/* Monthly Plan */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-6 border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-bold">月額プラン</h3>
                  <p className="text-white/60 text-sm">月ごとに更新</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">¥980</div>
                  <p className="text-white/50 text-xs">/月</p>
                </div>
              </div>
            </motion.div>

            {/* Annual Plan (Recommended) */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-6 border-2 border-green-500/40 relative overflow-hidden bg-green-500/5"
            >
              {/* Badge */}
              <div className="absolute top-0 right-0 px-4 py-1 bg-green-500/30 text-green-300 text-xs font-bold rounded-bl-2xl">
                34%お得
              </div>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-bold">年額プラン</h3>
                  <p className="text-white/60 text-sm">
                    <span className="text-green-400 font-semibold">推奨</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">¥7,800</div>
                  <p className="text-white/50 text-xs">
                    ¥650/月相当
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={handleSubscribe}
            className="btn-primary mb-4"
          >
            7日間無料で試す
          </button>

          <p className="text-white/50 text-xs text-center leading-relaxed">
            いつでもキャンセル可能。
            <br />
            無料期間中は課金されません。
          </p>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 text-center border-white/10"
        >
          <p className="text-white/70 font-semibold mb-3">
            12,847人が利用中
          </p>

          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <p className="text-white text-sm font-bold">4.8 / 5.0</p>
          <p className="text-white/50 text-xs mt-1">2,341件のレビュー</p>
        </motion.div>

        {/* Trust Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 space-y-2"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span>安全で高速。すべてのデバイスで同期。</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span>カスタマーサポート対応。日本語対応。</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span>月1回、新しい機能を追加予定。</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
