import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

/**
 * PaywallGate - Wraps premium content
 * Shows content if user is premium, otherwise shows upgrade CTA
 *
 * Usage:
 *   <PaywallGate feature="detailed_report" fallback={<LockedPreview />}>
 *     <PremiumContent />
 *   </PaywallGate>
 */

const featureLabels = {
  detailed_report: {
    title: '詳細レポート',
    description: 'AI分析の詳細な内訳、経時変化の統計分析、カスタム改善プランが利用可能になります。',
  },
  before_after: {
    title: 'Before/After比較',
    description: '過去のスキャン結果と並べて比較し、改善を可視化できます。',
  },
  ai_prediction: {
    title: 'AI経過予測',
    description: 'AIがあなたのトレーニング状況から、4週間後の予測スコアを算出します。',
  },
  advanced_exercises: {
    title: '上級エクササイズ',
    description: '医療専門家監修の高度なエクササイズで、より効果的な改善を目指します。',
  },
  unlimited_scans: {
    title: '無制限スキャン',
    description: '毎日のスキャンで変化を継続的にトラッキングできます。',
  },
}

export default function PaywallGate({ feature, children, fallback, inline = false }) {
  const navigate = useNavigate()
  const { state } = useApp()

  if (state.isPremium) {
    return children
  }

  const info = featureLabels[feature] || { title: 'プレミアム機能', description: 'この機能はプレミアムプランで利用可能です。' }

  if (inline) {
    // Compact inline version (for within cards)
    return (
      <div className="relative">
        {fallback && <div className="opacity-30 pointer-events-none">{fallback}</div>}
        <div className={`${fallback ? 'absolute inset-0' : ''} flex flex-col items-center justify-center p-4`}>
          <Lock className="w-5 h-5 text-white/40 mb-2" />
          <p className="text-white/60 text-xs text-center mb-2">{info.title}</p>
          <button onClick={() => navigate('/premium')}
            className="px-4 py-1.5 rounded-lg bg-green-500/20 border border-green-400/30 text-green-400 text-xs font-medium">
            アップグレード
          </button>
        </div>
      </div>
    )
  }

  // Full-width card version
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(45,212,191,0.03))' }}>

      {fallback && (
        <div className="opacity-20 pointer-events-none max-h-40 overflow-hidden">
          {fallback}
        </div>
      )}

      <div className="p-6 text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(45,212,191,0.1))', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Lock className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-white font-bold mb-1">{info.title}</h3>
        <p className="text-white/50 text-sm mb-4 leading-relaxed">{info.description}</p>
        <button onClick={() => navigate('/premium')}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <Zap className="w-4 h-4 inline mr-1" />
          プレミアムにアップグレード
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Checks if a feature should be gated based on usage
 * Returns true if the paywall should be shown
 */
export function shouldGate(state, feature) {
  if (state.isPremium) return false

  const totalSessions = state.training?.totalSessions || 0
  const scanCount = state.scanHistory?.length || 0

  switch (feature) {
    case 'detailed_report':
      // Gate after day 7 (show basic results for free, detailed after 7 days)
      return totalSessions >= 7
    case 'before_after':
      // Gate after 2 scans (let them see the concept, then gate)
      return scanCount >= 3
    case 'ai_prediction':
      // Always gated
      return true
    case 'advanced_exercises':
      // Gate after day 14
      return totalSessions >= 14
    case 'unlimited_scans':
      // Gate after 1 scan per week for free
      const thisWeekScans = (state.scanHistory || []).filter(s => {
        const d = new Date(s.date)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return d > weekAgo
      }).length
      return thisWeekScans >= 2
    default:
      return false
  }
}
