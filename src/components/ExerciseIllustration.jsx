import React from 'react'
import { motion } from 'framer-motion'

/**
 * Anatomical Exercise Illustrations
 * Bone/muscle structure with movement arrows
 * No face photos needed - professional medical style
 */

const illustrations = {
  // ---- Chin Tuck (チンタック) ----
  // Shows: cervical spine, skull base, movement direction
  chin_tuck: () => (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Cervical spine */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={108} y={95 + i * 18} width={24} height={14} rx={4}
          fill="none" stroke="#22c55e" strokeWidth="1.5" opacity={0.4} />
      ))}
      {/* Skull outline (side view) */}
      <path d="M 80,30 Q 80,10 120,8 Q 165,10 168,40 Q 170,60 155,75 Q 140,85 120,90 Q 105,88 95,82 Q 80,70 80,50 Z"
        fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
      {/* Jaw */}
      <path d="M 95,82 Q 90,95 100,100 Q 115,105 130,98 Q 140,90 140,82"
        fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
      {/* Platysma muscle (neck front) */}
      <path d="M 100,100 Q 95,130 92,170" fill="none" stroke="#2dd4bf" strokeWidth="6" opacity="0.12" strokeLinecap="round" />
      <path d="M 130,98 Q 135,130 138,170" fill="none" stroke="#2dd4bf" strokeWidth="6" opacity="0.12" strokeLinecap="round" />
      {/* SCM muscle */}
      <path d="M 155,75 Q 150,120 145,175" fill="none" stroke="#60a5fa" strokeWidth="4" opacity="0.15" strokeLinecap="round" />
      {/* Movement arrow - chin retraction */}
      <motion.g animate={{ x: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <line x1="78" y1="60" x2="60" y2="60" stroke="#22c55e" strokeWidth="2.5" />
        <polygon points="60,56 52,60 60,64" fill="#22c55e" />
      </motion.g>
      {/* Label */}
      <text x="120" y="228" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600" opacity="0.7">深層頸屈筋を活性化</text>
      {/* Muscle label */}
      <text x="70" y="145" fill="#2dd4bf" fontSize="8" opacity="0.5" transform="rotate(-85,70,145)">広頸筋</text>
      <text x="158" y="140" fill="#60a5fa" fontSize="8" opacity="0.5" transform="rotate(-80,158,140)">胸鎖乳突筋</text>
    </svg>
  ),

  // ---- Jaw Release (顎リリース) ----
  // Shows: jaw joint, masseter, temporalis
  jaw_release: () => (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Skull outline */}
      <path d="M 70,45 Q 70,20 120,15 Q 170,20 172,50 Q 174,70 158,82"
        fill="none" stroke="#2dd4bf" strokeWidth="2" opacity="0.4" />
      {/* Zygomatic arch */}
      <path d="M 158,62 Q 170,60 172,50" fill="none" stroke="#2dd4bf" strokeWidth="2" opacity="0.5" />
      {/* Temporal fossa */}
      <path d="M 155,35 Q 165,40 168,55" fill="none" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.3" />
      {/* TMJ joint marker */}
      <motion.circle cx="158" cy="72" r="5" fill="#fb923c" opacity="0.4"
        animate={{ r: [5, 7, 5], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <text x="170" y="72" fill="#fb923c" fontSize="7" opacity="0.6">顎関節</text>
      {/* Mandible (jaw bone) */}
      <motion.path
        fill="none" stroke="#2dd4bf" strokeWidth="2"
        animate={{
          d: [
            'M 158,82 Q 150,100 130,108 Q 110,112 90,105 Q 78,95 75,82',
            'M 158,82 Q 150,108 130,118 Q 110,122 90,112 Q 78,100 75,82',
            'M 158,82 Q 150,100 130,108 Q 110,112 90,105 Q 78,95 75,82',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Masseter muscle */}
      <path d="M 155,65 Q 158,80 152,95 Q 148,80 155,65" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1" />
      <text x="162" y="90" fill="#ef4444" fontSize="7" opacity="0.5">咬筋</text>
      {/* Temporalis muscle */}
      <path d="M 140,30 Q 155,35 158,55 Q 148,50 140,30" fill="#f472b6" opacity="0.12" stroke="#f472b6" strokeWidth="1" />
      <text x="130" y="35" fill="#f472b6" fontSize="7" opacity="0.5">側頭筋</text>
      {/* Release arrows */}
      <motion.g animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
        <line x1="148" y1="95" x2="140" y2="108" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="138,104 140,112 144,106" fill="#22c55e" />
      </motion.g>
      <text x="120" y="228" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="600" opacity="0.7">咬筋の緊張を解放</text>
    </svg>
  ),

  // ---- Neck Stretch ----
  // Shows: SCM, upper trapezius, scalenes
  neck_stretch: () => (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Shoulder line */}
      <path d="M 30,180 Q 80,168 120,172 Q 160,168 210,180" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.3" />
      {/* Cervical spine */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={110} y={80 + i * 16} width={20} height={12} rx={3}
          fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.35" />
      ))}
      {/* Head */}
      <motion.g
        animate={{ rotate: [0, -18, 0, 18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 80px' }}
      >
        <ellipse cx="120" cy="45" rx="35" ry="40" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.4" />
      </motion.g>
      {/* Upper trapezius (both sides) */}
      <path d="M 70,172 Q 90,140 108,85" fill="none" stroke="#f472b6" strokeWidth="5" opacity="0.12" strokeLinecap="round" />
      <path d="M 170,172 Q 150,140 132,85" fill="none" stroke="#f472b6" strokeWidth="5" opacity="0.12" strokeLinecap="round" />
      {/* SCM muscles */}
      <path d="M 80,175 Q 100,130 115,80" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.15" strokeLinecap="round" />
      <path d="M 160,175 Q 140,130 125,80" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.15" strokeLinecap="round" />
      {/* Labels */}
      <text x="55" y="150" fill="#f472b6" fontSize="7" opacity="0.5" transform="rotate(-55,55,150)">僧帽筋上部</text>
      <text x="175" y="130" fill="#fbbf24" fontSize="7" opacity="0.5" transform="rotate(55,175,130)">胸鎖乳突筋</text>
      {/* Stretch arrows */}
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 5, repeat: Infinity }}>
        <path d="M 145,35 Q 160,25 175,30" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="173,26 179,30 173,34" fill="#22c55e" />
      </motion.g>
      <text x="120" y="228" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600" opacity="0.7">首まわりの筋肉をストレッチ</text>
    </svg>
  ),

  // ---- Posture Correction ----
  // Shows: full spine alignment, before/after
  posture: () => (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* BAD posture (left, faded) */}
      <g opacity="0.25">
        {/* Forward head */}
        <circle cx="60" cy="35" r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        {/* Curved spine */}
        <path d="M 70,52 Q 62,70 58,90 Q 52,120 55,150 Q 58,175 65,200"
          fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x="40" y="218" fill="#ef4444" fontSize="9" opacity="0.8">Before</text>
      </g>
      {/* Arrow */}
      <motion.g animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
        <line x1="95" y1="110" x2="120" y2="110" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="118,106 126,110 118,114" fill="#22c55e" />
      </motion.g>
      {/* GOOD posture (right, emphasized) */}
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
        {/* Aligned head */}
        <circle cx="160" cy="28" r="18" fill="none" stroke="#22c55e" strokeWidth="2" />
        {/* Straight spine */}
        <path d="M 160,46 Q 160,70 160,90 Q 160,120 160,150 Q 160,175 160,200"
          fill="none" stroke="#22c55e" strokeWidth="2" />
        {/* Vertebrae markers */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={160} cy={50 + i * 20} r="3" fill="#22c55e" opacity="0.3" />
        ))}
        {/* Plumb line */}
        <line x1="160" y1="10" x2="160" y2="210" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <text x="145" y="218" fill="#22c55e" fontSize="9" fontWeight="600">After</text>
      </motion.g>
      {/* Ear-shoulder alignment marker */}
      <motion.g animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
        <line x1="160" y1="28" x2="160" y2="68" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="160" cy="28" r="3" fill="#fbbf24" opacity="0.5" />
        <circle cx="160" cy="68" r="3" fill="#fbbf24" opacity="0.5" />
        <text x="168" y="50" fill="#fbbf24" fontSize="7" opacity="0.6">耳-肩ライン</text>
      </motion.g>
      <text x="120" y="235" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600" opacity="0.7">耳と肩を垂直に整える</text>
    </svg>
  ),

  // ---- Face Lift / Cheek Elevation ----
  // Shows: facial muscles (zygomatic major/minor, levator)
  face_lift: () => (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Face outline (frontal) */}
      <ellipse cx="120" cy="100" rx="55" ry="70" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.3" />
      {/* Jawline */}
      <path d="M 68,115 Q 85,155 120,165 Q 155,155 172,115" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.3" />
      {/* Eye sockets */}
      <ellipse cx="98" cy="82" rx="14" ry="8" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.3" />
      <ellipse cx="142" cy="82" rx="14" ry="8" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.3" />
      {/* Nose */}
      <path d="M 120,90 L 115,110 Q 120,114 125,110 Z" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.25" />
      {/* Zygomatic major (smile muscle) */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M 90,118 Q 80,108 75,95" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.25" strokeLinecap="round" />
        <path d="M 150,118 Q 160,108 165,95" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      </motion.g>
      {/* Levator labii */}
      <path d="M 100,115 Q 98,105 100,90" fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
      <path d="M 140,115 Q 142,105 140,90" fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
      {/* Mouth */}
      <motion.path
        fill="none" stroke="#f472b6" strokeWidth="1.5"
        animate={{
          d: [
            'M 105,125 Q 120,130 135,125',
            'M 102,122 Q 120,136 138,122',
            'M 105,125 Q 120,130 135,125',
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Lift arrows */}
      <motion.g animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <line x1="78" y1="110" x2="78" y2="95" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="74,97 78,89 82,97" fill="#22c55e" />
        <line x1="162" y1="110" x2="162" y2="95" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="158,97 162,89 166,97" fill="#22c55e" />
      </motion.g>
      {/* Labels */}
      <text x="58" y="100" fill="#ef4444" fontSize="7" opacity="0.5">大頬骨筋</text>
      <text x="88" y="88" fill="#fb923c" fontSize="7" opacity="0.4">上唇挙筋</text>
      <text x="120" y="228" textAnchor="middle" fill="#f472b6" fontSize="11" fontWeight="600" opacity="0.7">表情筋を引き上げる</text>
    </svg>
  ),
}

// Map exercise names/targets to illustration type
const exerciseToIllustration = {
  'チンタック': 'chin_tuck',
  '顎引き': 'chin_tuck',
  '広頸筋': 'jaw_release',
  'リリース': 'jaw_release',
  'ストレッチ': 'neck_stretch',
  'ネック': 'neck_stretch',
  '姿勢': 'posture',
  'ウォール': 'posture',
  '胸椎': 'posture',
  '表情': 'face_lift',
  '挙上': 'face_lift',
  'チーク': 'face_lift',
  'スマイル': 'face_lift',
}

export default function ExerciseIllustration({ exercise, size = 'md' }) {
  if (!exercise) return null

  let type = 'chin_tuck'
  const name = exercise.name || ''
  const target = exercise.target || ''

  for (const [keyword, illType] of Object.entries(exerciseToIllustration)) {
    if (name.includes(keyword) || target.includes(keyword)) {
      type = illType
      break
    }
  }

  const IllComponent = illustrations[type]
  if (!IllComponent) return null

  const sizeClass = size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-44 h-44' : 'w-32 h-32'

  return (
    <div className={`${sizeClass} mx-auto`}>
      <IllComponent />
    </div>
  )
}
