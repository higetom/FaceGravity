import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Target, HelpCircle, X, Share2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ============================================================
// Explanation Data
// ============================================================
const explanations = {
  cma: {
    title: 'ネックライン角度とは？',
    sections: [
      {
        heading: '何を測っているか',
        body: '顎の下から首にかけてのラインが作る角度です。いわゆる「二重あご」や「首のたるみ」の程度を数値化しています。フェイスラインスコア（正面の輪郭）とは別に、横顔のスッキリ度を測ります。',
      },
      {
        heading: '理想の範囲',
        body: '美容外科の国際誌（Aesthetic Surgery Journal）で、105〜120°が理想とされています。この範囲だと横顔がスッキリ見えます。',
      },
      {
        heading: '角度が大きいと？',
        body: '130°を超えると、いわゆる「二重顎」や「たるみ」の兆候です。姿勢の悪さ、加齢による広頸筋（首の筋肉）の緩みが主な原因です。',
      },
      {
        heading: '改善できるの？',
        body: 'はい。姿勢矯正と広頸筋トレーニングで多くの場合改善します。このアプリのプログラムはまさにこの改善を目的に設計されています。',
      },
    ],
  },
  jdi: {
    title: 'ジョーラインスコア (JDI) とは？',
    sections: [
      {
        heading: '何を測っているか',
        body: '「フェイスライン（エラからアゴにかけてのライン）」がどれだけシャープかを0〜100点で数値化したものです。',
      },
      {
        heading: 'どうやって測定？',
        body: 'AIが顔の468個のポイントを検出し、下顎の角度（理想は115〜125°）と顎幅と顔幅の比率（理想は0.75〜0.85）から算出しています。',
      },
      {
        heading: '点数の目安',
        body: '75点以上: フェイスラインがはっきり。55〜74点: やや輪郭がぼやけている。54点以下: 改善の余地が大きい。',
      },
      {
        heading: 'なぜぼやけるの？',
        body: '加齢、姿勢不良、咬筋の過緊張、皮下脂肪の蓄積などが原因です。特に長時間のスマホ使用は顎周りの筋バランスを崩します。',
      },
    ],
  },
  posture: {
    title: '姿勢グレードとは？',
    sections: [
      {
        heading: '何を測っているか',
        body: '「耳の位置」と「肩の位置」の関係から、頭がどれだけ前に出ているか（前方頭位: Forward Head Posture）を角度で計測しています。',
      },
      {
        heading: 'グレードの基準',
        body: 'A (0〜10°): 理想的。B (11〜20°): やや前傾。C (21〜30°): スマホ首の傾向。D (31°以上): 要改善。',
      },
      {
        heading: '顔のたるみと何の関係が？',
        body: '頭が1cm前に出ると、首への負荷は約2kg増えます。この負荷が首前面の広頸筋を常に伸張させ、顎下のたるみの直接原因になります。',
      },
      {
        heading: '改善方法',
        body: 'チンタック（顎引き運動）、ウォールエンジェル、胸椎伸展エクササイズが有効です。このアプリの「姿勢矯正」カテゴリで実践できます。',
      },
    ],
  },
  causality: {
    title: 'なぜ姿勢とたるみは関係するの？',
    sections: [
      {
        heading: 'メカニズム',
        body: '前傾姿勢で頭部が前方にずれると、重力の方向に対して顔面組織が不利な位置になります。さらに広頸筋（platysma）が常に伸張され、組織を支える力が低下します。',
      },
      {
        heading: '科学的根拠',
        body: 'Northwestern大学の研究では、表情筋トレーニングを20週間続けた被験者で、見た目年齢が平均3歳若返ったと報告されています。姿勢改善は筋トレの効果をさらに高めます。',
      },
      {
        heading: 'どのくらいで効果が出る？',
        body: '姿勢の改善は2〜3週間で自覚できます。フェイスラインの変化は4〜8週間が目安です。毎日の継続が最も重要です。',
      },
    ],
  },
}

// ============================================================
// InfoModal Component
// ============================================================
function InfoModal({ info, onClose }) {
  if (!info) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[430px] max-h-[80vh] bg-dark-900 rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{info.title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          <div className="space-y-5">
            {info.sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                  >
                    {i + 1}
                  </div>
                  <h4 className="text-white font-semibold text-sm">{section.heading}</h4>
                </div>
                <p className="text-white/70 text-sm leading-relaxed pl-9">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================
// SectionHeader Component (tappable with ? icon)
// ============================================================
function SectionHeader({ title, onInfoTap }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-1 h-6 gradient-brand rounded-full" />
      <h2 className="text-lg font-bold text-white flex-1">{title}</h2>
      {onInfoTap && (
        <button
          onClick={onInfoTap}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
        >
          <HelpCircle className="w-4 h-4 text-white/50" />
        </button>
      )}
    </div>
  )
}

// ============================================================
// SNS Share Card Generator
// ============================================================
function generateShareCard({ cmaAngle, cmaGrade, jdi, postureGrade, postureAngle, streakDays }) {
  return new Promise((resolve) => {
    const W = 1080, H = 1350
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#0c1222')
    bg.addColorStop(0.5, '#0f172a')
    bg.addColorStop(1, '#0c1222')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Accent glow
    const glow = ctx.createRadialGradient(W / 2, 400, 0, W / 2, 400, 400)
    glow.addColorStop(0, 'rgba(34,197,94,0.08)')
    glow.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)

    // App name
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '500 28px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('FaceGravity', W / 2, 80)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 52px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('AI顔診断レポート', W / 2, 160)

    // Decorative line
    const lineGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0)
    lineGrad.addColorStop(0, 'rgba(34,197,94,0)')
    lineGrad.addColorStop(0.5, 'rgba(34,197,94,0.8)')
    lineGrad.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.fillStyle = lineGrad
    ctx.fillRect(W / 2 - 120, 190, 240, 2)

    // Score cards
    const cards = [
      { label: 'ネックライン角度', value: `${cmaGrade}`, sub: `${cmaAngle}°`, color: '#22c55e' },
      { label: 'フェイスライン (JDI)', value: `${jdi}`, sub: '/ 100', color: '#2dd4bf' },
      { label: '姿勢', value: postureGrade, sub: `${postureAngle}°`, color: '#60a5fa' },
    ]

    const cardW = 280, cardH = 300, gap = 40
    const startX = (W - (cardW * 3 + gap * 2)) / 2
    const cardY = 260

    cards.forEach((card, i) => {
      const x = startX + i * (cardW + gap)

      // Card background
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      roundRect(ctx, x, cardY, cardW, cardH, 24)
      ctx.fill()

      // Card border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      roundRect(ctx, x, cardY, cardW, cardH, 24)
      ctx.stroke()

      // Top accent bar
      ctx.fillStyle = card.color
      ctx.fillRect(x + 40, cardY + 20, cardW - 80, 3)

      // Label
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.font = '500 24px Inter, "Noto Sans JP", sans-serif'
      ctx.fillText(card.label, x + cardW / 2, cardY + 70)

      // Value
      ctx.fillStyle = card.color
      ctx.font = '800 80px Inter, "Noto Sans JP", sans-serif'
      ctx.fillText(card.value, x + cardW / 2, cardY + 185)

      // Sub value
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '400 28px Inter, "Noto Sans JP", sans-serif'
      ctx.fillText(card.sub, x + cardW / 2, cardY + 240)
    })

    // Assessment section
    const assessY = cardY + cardH + 80
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 36px Inter, "Noto Sans JP", sans-serif'

    let assessment = ''
    if (cmaAngle <= 120 && jdi >= 70) {
      assessment = '良好な状態です！維持を目指しましょう'
    } else if (cmaAngle > 135 || jdi < 45) {
      assessment = '改善の余地があります。一緒に頑張りましょう！'
    } else {
      assessment = '少しの改善で大きな変化が期待できます'
    }
    ctx.fillText(assessment, W / 2, assessY)

    // Streak badge
    if (streakDays > 0) {
      const badgeY = assessY + 60
      ctx.fillStyle = 'rgba(249,115,22,0.15)'
      roundRect(ctx, W / 2 - 140, badgeY, 280, 60, 30)
      ctx.fill()
      ctx.strokeStyle = 'rgba(249,115,22,0.3)'
      ctx.lineWidth = 1
      roundRect(ctx, W / 2 - 140, badgeY, 280, 60, 30)
      ctx.stroke()
      ctx.fillStyle = '#fb923c'
      ctx.font = '600 28px Inter, "Noto Sans JP", sans-serif'
      ctx.fillText(`${streakDays}日連続トレーニング中`, W / 2, badgeY + 40)
    }

    // Bottom CTA section
    const ctaY = H - 280
    ctx.fillStyle = 'rgba(34,197,94,0.1)'
    roundRect(ctx, 60, ctaY, W - 120, 160, 24)
    ctx.fill()
    ctx.strokeStyle = 'rgba(34,197,94,0.2)'
    ctx.lineWidth = 1
    roundRect(ctx, 60, ctaY, W - 120, 160, 24)
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.fillStyle = '#22c55e'
    ctx.font = '700 32px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('姿勢を変えたら、顔が変わった。', W / 2, ctaY + 60)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '400 24px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('FaceGravity で無料診断してみよう', W / 2, ctaY + 110)

    // App badge
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '400 20px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('facegravity.app', W / 2, H - 60)

    // Disclaimer
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '400 16px Inter, "Noto Sans JP", sans-serif'
    ctx.fillText('※ AI分析による参考値です。医療診断ではありません。', W / 2, H - 25)

    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0)
  })
}

// Rounded rect helper
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ============================================================
// Main Component
// ============================================================
export default function DiagnosisResult() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [animateValues, setAnimateValues] = useState(false)
  const [activeInfo, setActiveInfo] = useState(null) // key of explanations
  const [visibleSections, setVisibleSections] = useState({
    cma: false,
    jdi: false,
    posture: false,
    causality: false,
    cta: false,
  })

  const {
    cmaAngle = 118, cmaGrade = 'C', jdi = 62,
    postureGrade = 'C', postureAngle = 28,
    symmetry = 80, midfaceSag = 60, isReal = false,
    cmaConfidence = 0, cmaMethod = 'none',
  } = state.diagnosis

  const methodLabel = {
    dlib_68: 'dlib 68-point (高精度)',
    combined: 'Face Mesh + BlazePose',
    face_mesh_only: 'Face Mesh',
    pose_only: 'BlazePose',
    frontal_proxy: '正面推定',
    demo: 'デモデータ',
    none: '--',
  }

  useEffect(() => {
    const timings = { cma: 0, jdi: 400, posture: 800, causality: 1200, cta: 1600 }
    Object.entries(timings).forEach(([section, delay]) => {
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, [section]: true })), delay)
    })
    setTimeout(() => setAnimateValues(true), 300)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const handleCtaClick = () => navigate('/home')

  // SNS Share
  const [isSharing, setIsSharing] = useState(false)
  const handleShare = useCallback(async () => {
    setIsSharing(true)
    try {
      const blob = await generateShareCard({
        cmaAngle, cmaGrade, jdi, postureGrade, postureAngle,
        streakDays: state.streak?.current || 0,
      })

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'facegravity-result.png', { type: 'image/png' })
        const shareData = {
          title: 'FaceGravity AI診断結果',
          text: `FaceGravityで顔診断しました！ネックライン: ${cmaGrade} / フェイスライン: ${jdi}/100 / 姿勢: ${postureGrade}`,
          files: [file],
        }
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          setIsSharing(false)
          return
        }
      }
      // Fallback: download image
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'facegravity-result.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Share error:', err)
    }
    setIsSharing(false)
  }, [cmaAngle, cmaGrade, jdi, postureGrade, postureAngle, state.streak])

  // Counter animation
  const AnimatedCounter = ({ from = 0, to, duration = 2 }) => {
    const [count, setCount] = useState(from)
    useEffect(() => {
      if (!animateValues) return
      let v = from
      const diff = to - from
      if (diff <= 0) { setCount(to); return }
      const ms = (duration * 1000) / diff
      const timer = setInterval(() => {
        v += 1
        if (v >= to) { setCount(to); clearInterval(timer) }
        else setCount(v)
      }, ms)
      return () => clearInterval(timer)
    }, [animateValues, from, to, duration])
    return <span>{count}</span>
  }

  // Circular gauge for CMA
  const CircularGauge = ({ value = 118, min = 105, max = 135, radius = 60 }) => {
    const circ = 2 * Math.PI * radius
    const norm = ((value - min) / (max - min)) * 100
    const offset = circ - (norm / 100) * circ

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg width="160" height="160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle cx="80" cy="80" r={radius} fill="none" stroke="url(#gradeGradient)" strokeWidth="8"
              strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: animateValues ? offset : circ }}
              transition={{ duration: 2, ease: 'easeInOut' }} strokeLinecap="round" />
            <defs>
              <linearGradient id="gradeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div className="absolute flex flex-col items-center"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <motion.span className="text-5xl font-bold gradient-text"
              initial={{ opacity: 0 }} animate={{ opacity: animateValues ? 1 : 0 }}>
              {cmaGrade}
            </motion.span>
            <span className="text-white/60 text-xs font-semibold">
              {animateValues && <AnimatedCounter from={105} to={cmaAngle} duration={2} />}{'\u00B0'}
            </span>
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-white font-semibold">
            {cmaAngle >= 105 && cmaAngle <= 120 ? 'ネックライン角度は理想範囲内' :
             cmaAngle < 105 ? 'ネックライン角度がやや鋭角' : 'ネックライン角度にたるみの兆候'}
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            理想範囲は105-120{'\u00B0'}です。あなたの測定値は{cmaAngle}{'\u00B0'}
            {cmaAngle >= 105 && cmaAngle <= 120 ? 'で、良好な状態です。' :
             cmaAngle > 120 && cmaAngle <= 135 ? 'で、軽い改善で大きな効果が期待できます。' :
             'です。適切なトレーニングで改善を目指しましょう。'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mobile-container bg-dark-950 flex flex-col overflow-hidden">

      {/* Info Modal */}
      <AnimatePresence>
        {activeInfo && (
          <InfoModal info={explanations[activeInfo]} onClose={() => setActiveInfo(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div className="page-padding flex-shrink-0 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-white">診断結果</h1>
          <p className="text-white/60 text-sm mt-2">
            {isReal
              ? `${methodLabel[cmaMethod] || cmaMethod} / 信頼度 ${Math.round(cmaConfidence * 100)}%`
              : 'デモモードの参考結果です'}
          </p>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="page-padding pb-8 space-y-6">

          {/* CMA Score */}
          {visibleSections.cma && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="glass-card p-6">
              <SectionHeader title="ネックライン角度" onInfoTap={() => setActiveInfo('cma')} />
              <CircularGauge value={cmaAngle} />
            </motion.div>
          )}

          {/* JDI */}
          {visibleSections.jdi && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="glass-card p-6">
              <SectionHeader title="ジョーラインスコア" onInfoTap={() => setActiveInfo('jdi')} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/80 font-semibold">スコア</span>
                    <span className="text-2xl font-bold gradient-text">
                      {animateValues && <AnimatedCounter from={0} to={jdi} duration={2} />}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: animateValues ? `${jdi}%` : 0 }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                      className="h-full gradient-brand rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>0</span><span>100</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white font-semibold mb-2">
                    {jdi >= 75 ? 'フェイスラインは明瞭' : jdi >= 55 ? 'フェイスラインにやや改善余地あり' : 'フェイスラインの引き締めが推奨されます'}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    あなたのスコアは{jdi}点{jdi >= 75 ? 'で、良好な輪郭を維持しています。' : jdi >= 55 ? 'で、やや輪郭がぼやけている傾向があります。顔の側面の引き締めで改善可能です。' : 'で、下顎ラインの改善が望まれます。挙上筋トレーニングが効果的です。'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posture Grade */}
          {visibleSections.posture && (() => {
            // Determine posture status label and color
            const postureStatus =
              postureAngle <= 10 ? { label: '良好', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', desc: '理想的な姿勢です。この状態を維持していきましょう。' }
              : postureAngle <= 20 ? { label: 'やや前傾', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', desc: '軽い前傾姿勢の傾向があります。意識的に姿勢を正すことで改善できます。' }
              : postureAngle <= 35 ? { label: '前に出ている', color: '#fb923c', bg: 'rgba(251,146,60,0.15)', desc: 'スマホやデスクワークによる前傾姿勢が見られます。フェイスラインのたるみに直結するため、改善が効果的です。' }
              : { label: '大きく前傾', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', desc: '頭部が大きく前方に出ています。首・肩まわりの筋バランスを整えることで、顔まわりの印象が大きく変わります。' }

            return (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="glass-card p-6">
                <SectionHeader title="姿勢の状態" onInfoTap={() => setActiveInfo('posture')} />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: postureStatus.bg, border: `1px solid ${postureStatus.color}33`, boxShadow: `0 4px 20px ${postureStatus.color}20` }}>
                        <span className="text-4xl font-bold" style={{ color: postureStatus.color }}>{postureGrade}</span>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: postureStatus.bg, color: postureStatus.color, border: `1px solid ${postureStatus.color}30` }}>
                          {postureStatus.label}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs">頭部の前方傾斜</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {postureStatus.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })()}

          {/* Causality Explanation */}
          {visibleSections.causality && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="glass-card p-6 border-l-2 border-l-green-400">
              <SectionHeader title="姿勢とたるみの因果関係" onInfoTap={() => setActiveInfo('causality')} />
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {[
                  { num: '\u2460', text: <><span className="font-semibold text-white">姿勢のズレ</span>（{postureAngle}{'\u00B0'}）が原因で、頭部が前方に傾きます</> },
                  { num: '\u2461', text: <>この姿勢により<span className="font-semibold text-white">顎周辺の筋肉</span>に緊張が生じます</> },
                  { num: '\u2462', text: <>その結果、<span className="font-semibold text-white">ネックライン角度が拡大</span>し、たるみが増加します</> },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                        className="px-4 py-1 text-center">
                        <ChevronDown size={18} className="mx-auto text-green-400" />
                      </motion.div>
                    )}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-brand text-sm font-bold text-white">
                          {item.num}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </React.Fragment>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm leading-relaxed">
                    良い知らせは、これらは<span className="text-green-400 font-semibold">すべて改善可能</span>です。正しい姿勢と専用トレーニングで、3-4週間で効果が期待できます。
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CTA */}
          {visibleSections.cta && (() => {
            // Calculate achievable target (gentle, not extreme)
            const targetCma = cmaAngle > 120 ? Math.max(115, cmaAngle - Math.round((cmaAngle - 115) * 0.4)) : cmaAngle
            const targetJdi = jdi < 75 ? Math.min(80, jdi + Math.round((80 - jdi) * 0.4)) : jdi

            return (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {/* Main CTA card */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    4週間でフェイスラインを引き締める
                  </h3>

                  {/* Current vs Target */}
                  {(cmaAngle > 120 || jdi < 75) && (
                    <div className="mt-4 mb-5 grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/40 text-xs mb-1">現在</p>
                        <p className="text-white font-bold text-lg">{cmaAngle}{'\u00B0'}</p>
                        <p className="text-white/30 text-[10px]">ネックライン角度</p>
                      </div>
                      <div className="text-center p-3 rounded-xl border"
                        style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
                        <p className="text-green-400/60 text-xs mb-1">4週間後の目標</p>
                        <p className="text-green-400 font-bold text-lg">{targetCma}{'\u00B0'}</p>
                        <p className="text-green-400/40 text-[10px]">無理のない目標値</p>
                      </div>
                    </div>
                  )}

                  {/* Mechanism explanation */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <p className="text-white/80 text-sm leading-relaxed text-center">
                      姿勢を整えることで<br />
                      顎まわりの筋肉が引き締まり<br />
                      <span className="text-green-400 font-semibold">フェイスラインがスッキリ</span>していきます
                    </p>
                  </div>

                  {/* PT supervised badge */}
                  <div className="flex items-center justify-center gap-2 mb-4 py-2.5 rounded-xl bg-blue-500/8 border border-blue-400/15">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-blue-400/80 text-xs font-medium">理学療法士監修プログラム</span>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCtaClick} className="btn-primary">
                  無料で始める
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCtaClick} className="btn-secondary">
                  7日間無料トライアル（年間プラン）
                </motion.button>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-white/50 text-xs text-center pt-2">
                  クレジットカード不要。いつでもキャンセルできます。
                </motion.p>
              </motion.div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
