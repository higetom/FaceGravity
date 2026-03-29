import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Bell,
  Zap,
  Lock,
  FileText,
  Mail,
  Package,
  Flame,
  Trophy,
  BookOpen,
  BellRing,
  Clock,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  requestNotificationPermission,
} from '../lib/notifications'

export default function Profile() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [showNotifSettings, setShowNotifSettings] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState(getNotificationPrefs())
  const [permissionStatus, setPermissionStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

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

  // Get user's first character as avatar initial
  const userInitial = state.user.name ? state.user.name.charAt(0).toUpperCase() : 'U'

  // Get age group display
  const ageGroupDisplay =
    {
      '10-20': '10-20歳',
      '20-30': '20-30歳',
      '30-40': '30-40歳',
      '40-50': '40-50歳',
      '50+': '50歳以上',
    }[state.user.age] || state.user.age

  const handleToggleNotifications = async () => {
    if (!notifPrefs.enabled) {
      const result = await requestNotificationPermission()
      if (result.granted) {
        const updated = { ...notifPrefs, enabled: true, permissionGranted: true }
        setNotifPrefs(updated)
        saveNotificationPrefs(updated)
        setPermissionStatus('granted')
      } else if (result.denied) {
        setPermissionStatus('denied')
      }
    } else {
      const updated = { ...notifPrefs, enabled: false }
      setNotifPrefs(updated)
      saveNotificationPrefs(updated)
    }
  }

  const handleTimeChange = (time) => {
    const updated = { ...notifPrefs, time }
    setNotifPrefs(updated)
    saveNotificationPrefs(updated)
  }

  const settingsItems = [
    {
      icon: Bell,
      label: '通知設定',
      onClick: () => setShowNotifSettings(true),
      showChevron: true,
      badge: notifPrefs.enabled ? 'ON' : null,
    },
    {
      icon: Zap,
      label: 'プラン変更',
      onClick: () => navigate('/premium'),
      showChevron: true,
    },
    {
      icon: FileText,
      label: '利用規約',
      onClick: () => {}, // Placeholder
      showChevron: true,
    },
    {
      icon: Lock,
      label: 'プライバシーポリシー',
      onClick: () => {}, // Placeholder
      showChevron: true,
    },
    {
      icon: Mail,
      label: 'お問い合わせ',
      onClick: () => {}, // Placeholder
      showChevron: true,
    },
  ]

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
          <h1 className="text-3xl font-bold text-white">プロフィール</h1>
          <p className="text-white/50 text-sm mt-1">アカウント設定</p>
        </motion.div>

        {/* Profile Header Section */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 mb-8 text-center"
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">{userInitial}</span>
          </div>

          {/* User Info */}
          <h2 className="text-white font-bold text-xl mb-1">
            {state.user.name || 'ユーザー'}さん
          </h2>
          <p className="text-white/60 text-sm mb-4">{ageGroupDisplay}</p>

          {/* Plan Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5">
            <Package size={14} className={state.isPremium ? 'text-green-400' : 'text-white/50'} />
            <span className={`text-sm font-semibold ${state.isPremium ? 'text-green-400' : 'text-white/60'}`}>
              {state.isPremium ? 'Premium プラン' : 'Free プラン'}
            </span>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-white/80 text-sm font-bold mb-3">統計情報</h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Total Sessions */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">総トレーニング</p>
                  <p className="text-white font-bold text-lg">
                    {state.training.totalSessions}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flame size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">現在のストリーク</p>
                  <p className="text-white font-bold text-lg">
                    {state.streak.current}日
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Longest Streak */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">最高記録</p>
                  <p className="text-white font-bold text-lg">
                    {state.streak.longest}日
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Lessons Completed */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">完了レッスン</p>
                  <p className="text-white font-bold text-lg">
                    {state.lessons.completed.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Upgrade Banner (if not premium) */}
        {!state.isPremium && (
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 mb-8 border-2 border-green-500/30 bg-green-500/5"
          >
            <h3 className="text-white font-bold mb-2">プレミアムにアップグレード</h3>
            <p className="text-white/70 text-sm mb-4">
              週次スキャン比較、因果関係分析など、プレミアム機能をすべて利用できます。
            </p>
            <button
              onClick={() => navigate('/premium')}
              className="btn-primary"
            >
              詳細を見る
            </button>
          </motion.div>
        )}

        {/* Settings Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-white/80 text-sm font-bold mb-3">設定</h3>

          <div className="space-y-2">
            {settingsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  onClick={item.onClick}
                  className="glass-card p-4 flex items-center justify-between w-full hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <Icon size={18} className="text-white/70" />
                    </div>
                    <span className="text-white font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.showChevron && (
                    <ChevronRight size={18} className="text-white/40" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Version */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center pb-4"
        >
          <p className="text-white/40 text-xs">バージョン 1.0.0</p>
          <p className="text-white/30 text-xs mt-1">
            &copy; 2024 FaceGravity. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showNotifSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowNotifSettings(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[430px] bg-dark-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-green-400" />
                  通知設定
                </h3>
                <button onClick={() => setShowNotifSettings(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Enable toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">リマインダー通知</p>
                    <p className="text-white/50 text-xs mt-0.5">トレーニング忘れを防ぎます</p>
                  </div>
                  <button onClick={handleToggleNotifications}
                    className={`w-12 h-7 rounded-full transition-colors relative ${notifPrefs.enabled ? 'bg-green-500' : 'bg-white/20'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${notifPrefs.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {permissionStatus === 'denied' && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20">
                    <p className="text-red-400 text-xs">通知がブロックされています。ブラウザの設定で通知を許可してください。</p>
                  </div>
                )}

                {permissionStatus === 'unsupported' && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-400/20">
                    <p className="text-yellow-400 text-xs">このブラウザは通知に対応していません。</p>
                  </div>
                )}

                {/* Time selector */}
                {notifPrefs.enabled && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <p className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      通知時刻
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {['20:00', '21:00', '22:00'].map((time) => (
                        <button key={time} onClick={() => handleTimeChange(time)}
                          className={`py-3 rounded-xl text-sm font-medium transition ${
                            notifPrefs.time === time
                              ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                              : 'bg-white/5 border border-white/10 text-white/60'
                          }`}>
                          {time}
                        </button>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs mt-3">
                      その日のトレーニングが未完了の場合に通知されます
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="h-8" /> {/* Bottom safe area */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
