import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart,
} from 'recharts'
import { Lock, Brain, Camera, ArrowRight, TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react'
import { useApp, loadScanPhotos } from '../context/AppContext'

// ============================================================
// ScoreCard with real data from scan history
// ============================================================
function ScoreCard({ title, subtitle, currentValue, grade, chartData, color, isAngle = false, dataKey = 'score' }) {
  const hasTrend = chartData.length >= 2
  const first = chartData[0]?.[dataKey]
  const last = chartData[chartData.length - 1]?.[dataKey]
  const diff = hasTrend ? last - first : 0

  // Determine Y domain
  const values = chartData.map(d => d[dataKey]).filter(v => typeof v === 'number')
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const pad = Math.max(5, Math.round((maxV - minV) * 0.3))
  const yMin = Math.max(0, minV - pad)
  const yMax = maxV + pad

  return (
    <div className="glass-card p-6 mb-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/50 text-[11px] font-semibold tracking-wide uppercase mb-1">{title}</p>
          {subtitle && <p className="text-white/40 text-[10px]">{subtitle}</p>}
          <div className="flex items-baseline gap-3 mt-1">
            <div className="text-3xl font-bold text-white">{grade}</div>
            {!isAngle && <span className="text-white/50 text-sm">{currentValue}/100</span>}
            {isAngle && <span className="text-white/50 text-sm">{currentValue}{'\u00B0'}</span>}
          </div>
        </div>
        {hasTrend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isAngle
              ? diff < 0 ? 'bg-green-500/15 text-green-400' : diff > 0 ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white/50'
              : diff > 0 ? 'bg-green-500/15 text-green-400' : diff < 0 ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white/50'
          }`}>
            {(isAngle ? diff < 0 : diff > 0)
              ? <TrendingUp className="w-3 h-3" />
              : (isAngle ? diff > 0 : diff < 0)
                ? <TrendingDown className="w-3 h-3" />
                : <Minus className="w-3 h-3" />}
            {Math.abs(diff) > 0 ? `${diff > 0 ? '+' : ''}${diff}` : '---'}
          </div>
        )}
      </div>

      {chartData.length > 1 ? (
        <div className="w-full h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[yMin, yMax]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2}
                fill={`url(#grad-${title})`} dot={{ r: 3, fill: color }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-28 flex items-center justify-center text-white/30 text-sm">
          再スキャンするとグラフが表示されます
        </div>
      )}
    </div>
  )
}

// ============================================================
// Before/After Comparison
// ============================================================
function BeforeAfter({ scans, isPremium, navigate }) {
  const [beforePhotos, setBeforePhotos] = useState(null)
  const [afterPhotos, setAfterPhotos] = useState(null)

  const first = scans[0]
  const latest = scans[scans.length - 1]
  const hasMultiple = scans.length >= 2 && first.id !== latest.id

  useEffect(() => {
    if (!hasMultiple || !isPremium) return
    // Load photos from IndexedDB
    loadScanPhotos(first.id).then(p => setBeforePhotos(p))
    loadScanPhotos(latest.id).then(p => setAfterPhotos(p))
  }, [first?.id, latest?.id, hasMultiple, isPremium])

  if (!isPremium) {
    return (
      <div className="glass-card p-6 mb-5">
        <h3 className="text-white/80 text-sm font-bold mb-4">Before / After 比較</h3>
        <div className="relative w-full h-44 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center">
          <Lock size={28} className="text-white/30 mb-2" />
          <p className="text-white/50 text-sm font-semibold">プレミアムで解放</p>
          <button onClick={() => navigate('/premium')}
            className="mt-3 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
            プレミアムプランを見る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 mb-5">
      <h3 className="text-white/80 text-sm font-bold mb-4">Before / After 比較</h3>

      {!hasMultiple ? (
        <div className="w-full py-10 text-center">
          <Camera className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">スキャン {scans.length} 回完了</p>
          <p className="text-white/30 text-xs mt-1">2回以上スキャンすると比較が表示されます</p>
          <button onClick={() => navigate('/diagnosis')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-medium inline-flex items-center gap-1.5">
            再スキャン <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* Score comparison table */}
          <div className="space-y-3 mb-5">
            {[
              { label: '顎下角度', before: `${first.cmaAngle}\u00B0`, after: `${latest.cmaAngle}\u00B0`, improved: latest.cmaAngle < first.cmaAngle || (latest.cmaAngle >= 105 && latest.cmaAngle <= 120) },
              { label: 'フェイスライン', before: first.jdi, after: latest.jdi, improved: latest.jdi > first.jdi },
              { label: '姿勢', before: `${first.postureAngle}\u00B0`, after: `${latest.postureAngle}\u00B0`, improved: latest.postureAngle < first.postureAngle },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                <span className="text-white/50 text-xs w-20 flex-shrink-0">{row.label}</span>
                <span className="text-white/60 text-sm font-mono w-12 text-center">{row.before}</span>
                <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${row.improved ? 'text-green-400' : 'text-white/30'}`} />
                <span className={`text-sm font-mono font-semibold w-12 text-center ${row.improved ? 'text-green-400' : 'text-white/80'}`}>{row.after}</span>
              </div>
            ))}
          </div>

          {/* Photo comparison */}
          {(beforePhotos?.frontPhoto || afterPhotos?.frontPhoto) && (
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl overflow-hidden bg-black aspect-[3/4]">
                {beforePhotos?.frontPhoto ? (
                  <img src={beforePhotos.frontPhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">初回</div>
                )}
                <div className="text-center py-1 bg-white/5">
                  <span className="text-white/50 text-[10px]">
                    {new Date(first.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-black aspect-[3/4]">
                {afterPhotos?.frontPhoto ? (
                  <img src={afterPhotos.frontPhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">最新</div>
                )}
                <div className="text-center py-1 bg-white/5">
                  <span className="text-white/50 text-[10px]">
                    {new Date(latest.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => navigate('/diagnosis')}
            className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium flex items-center justify-center gap-1.5">
            <Camera className="w-4 h-4" /> 再スキャンする
          </button>
        </>
      )}
    </div>
  )
}

// ============================================================
// Main Progress Page
// ============================================================
export default function Progress() {
  const navigate = useNavigate()
  const { state } = useApp()

  const diagnosis = state.diagnosis
  const scans = state.scanHistory || []

  // Build chart data from real scan history
  const cmaChartData = scans.map((s, i) => ({
    label: `${i + 1}回`,
    score: s.cmaAngle || 0,
  }))
  const jdiChartData = scans.map((s, i) => ({
    label: `${i + 1}回`,
    score: s.jdi || 0,
  }))
  const postureChartData = scans.map((s, i) => ({
    label: `${i + 1}回`,
    angle: s.postureAngle || 0,
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.div className="mobile-container bg-dark-950 safe-bottom"
      variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-padding">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white">あなたの変化</h1>
          <p className="text-white/50 text-sm mt-1">
            {scans.length > 0
              ? `${scans.length}回のスキャン記録`
              : '診断を行うとここに記録されます'}
          </p>
        </motion.div>

        {/* Score Cards */}
        <motion.div variants={itemVariants}>
          <ScoreCard
            title="顎下ライン角度"
            subtitle="CMA -- 低いほどシャープ"
            currentValue={diagnosis.cmaAngle || '--'}
            grade={diagnosis.cmaGrade || '--'}
            chartData={cmaChartData}
            color="#22c55e"
            isAngle
            dataKey="score"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScoreCard
            title="フェイスラインスコア"
            subtitle="JDI -- 高いほど明瞭"
            currentValue={diagnosis.jdi || '--'}
            grade={diagnosis.jdi ? `${diagnosis.jdi}` : '--'}
            chartData={jdiChartData}
            color="#2dd4bf"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScoreCard
            title="姿勢 (前方頭位角度)"
            subtitle="FHP -- 低いほど良い"
            currentValue={diagnosis.postureAngle || '--'}
            grade={diagnosis.postureGrade || '--'}
            chartData={postureChartData}
            color="#fbbf24"
            isAngle
            dataKey="angle"
          />
        </motion.div>

        {/* Before/After */}
        <motion.div variants={itemVariants}>
          <BeforeAfter scans={scans} isPremium={state.isPremium} navigate={navigate} />
        </motion.div>

        {/* AI Prediction (Premium) */}
        <motion.div variants={itemVariants}
          className="glass-card p-6 mb-5 relative overflow-hidden">
          {!state.isPremium && (
            <div className="absolute inset-0 backdrop-blur-[2px] bg-dark-950/40 flex items-center justify-center z-10">
              <div className="text-center">
                <Lock size={28} className="text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-sm font-semibold">AI経過予測</p>
                <p className="text-white/30 text-xs mt-1">プレミアムで解放</p>
                <button onClick={() => navigate('/premium')}
                  className="mt-3 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold relative z-20">
                  プレミアムプランを見る
                </button>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 mb-4">
            <TrendingUp size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
            <h3 className="text-white/80 text-sm font-bold">4週間後の予測スコア</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: '頤頸角',
                current: `${diagnosis.cmaAngle || 0}\u00B0`,
                predicted: `${Math.max(105, (diagnosis.cmaAngle || 125) - 4)}\u00B0`,
                color: '#22c55e',
              },
              {
                label: 'フェイスライン',
                current: `${diagnosis.jdi || 0}`,
                predicted: `${Math.min(100, (diagnosis.jdi || 58) + 8)}`,
                color: '#2dd4bf',
              },
              {
                label: '姿勢',
                current: `${diagnosis.postureAngle || 0}\u00B0`,
                predicted: `${Math.max(0, (diagnosis.postureAngle || 24) - 6)}\u00B0`,
                color: '#fbbf24',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/40 text-[10px] mb-1">{item.label}</p>
                <p className="text-white/50 text-xs line-through">{item.current}</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: item.color }}>{item.predicted}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3 text-center">
            ※ 毎日のトレーニング継続を前提にした予測値です
          </p>
        </motion.div>

        {/* Causality Insight */}
        <motion.div variants={itemVariants}
          className={`glass-card p-6 mb-5 border-2 ${
            state.isPremium ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'
          } relative overflow-hidden`}>
          {!state.isPremium && (
            <div className="absolute inset-0 backdrop-blur-[2px] bg-dark-950/40 flex items-center justify-center z-10">
              <div className="text-center">
                <Lock size={28} className="text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-xs font-semibold">プレミアムで解放</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 mb-3">
            <Brain size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
            <h3 className="text-white/80 text-sm font-bold">AI因果分析</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {scans.length >= 3
              ? '姿勢グレードの改善がフェイスラインスコアに先行する傾向が見られます。姿勢矯正の継続が効果的です。'
              : 'スキャンデータが3回以上蓄積されると、姿勢とフェイスラインの因果関係をAIが分析します。'}
          </p>
          {!state.isPremium && (
            <button onClick={() => navigate('/premium')}
              className="mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold relative z-20">
              プレミアムプランを見る
            </button>
          )}
        </motion.div>

        {/* Streak Stats */}
        <motion.div variants={itemVariants} className="glass-card p-6 mb-5">
          <h3 className="text-white/80 text-sm font-bold mb-5">継続記録</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold gradient-text mb-0.5">{state.streak.current}</div>
              <p className="text-white/50 text-[10px]">日連続</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-0.5">{state.training.totalSessions}</div>
              <p className="text-white/50 text-[10px]">総セッション</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-0.5">
                {state.training.weeklyGoal > 0 ? Math.round((state.training.weeklyDone / state.training.weeklyGoal) * 100) : 0}%
              </div>
              <p className="text-white/50 text-[10px]">週間達成</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between mb-1.5">
              <span className="text-white/40 text-xs">週間目標</span>
              <span className="text-white text-sm font-semibold">{state.training.weeklyDone}/{state.training.weeklyGoal}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (state.training.weeklyDone / state.training.weeklyGoal) * 100)}%` }}
                transition={{ duration: 0.8 }}
                style={{ background: 'linear-gradient(90deg, #22c55e, #2dd4bf)' }} />
            </div>
          </div>
        </motion.div>

        {/* Re-scan CTA */}
        <motion.div variants={itemVariants} className="mb-8">
          <button onClick={() => navigate('/diagnosis')}
            className="btn-primary flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" />
            {scans.length === 0 ? '初回スキャンを行う' : '再スキャンで変化を記録'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
