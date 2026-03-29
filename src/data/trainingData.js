export const trainingCategories = [
  {
    id: 'elevation',
    title: '挙上筋アクティベーション',
    subtitle: '顔の引き上げ力を取り戻す',
    icon: 'ArrowUp',
    color: '#22c55e',
    colorLight: 'rgba(34, 197, 94, 0.15)',
    exercises: [
      {
        id: 'cheek-lift',
        name: 'チークリフター',
        target: '大頬骨筋・小頬骨筋',
        duration: 60,
        description: '口角を最大限引き上げ、頬を高い位置でキープ。指で軽く抵抗を加えて負荷をかけます。',
        steps: [
          '口を軽く閉じ、口角に意識を集中',
          '口角を耳に向かって最大限引き上げる',
          '頬骨の上に指を軽く置き、下方向に軽い抵抗を加える',
          '最大挙上位で5秒キープ → ゆっくり戻す',
          '10回繰り返し',
        ],
        science: '大頬骨筋は口角から頬骨弓にかけて走行する挙上筋。この筋の筋力低下が中顔面の下垂（頬のたるみ）の直接的原因です。',
      },
      {
        id: 'temple-press',
        name: 'テンプルプレス',
        target: '側頭筋',
        duration: 45,
        description: '咬筋を弛緩させた状態で側頭筋を選択的に収縮させます。',
        steps: [
          '口を軽く開き、咬筋を弛緩させる',
          'こめかみに指を軽く当てる',
          '歯を噛みしめずに、こめかみの筋肉だけを動かす意識で収縮',
          '5秒収縮 → 5秒リラックス',
          '8回繰り返し',
        ],
        science: '側頭筋は下顎骨を挙上する強力な咀嚼筋。上部線維の活動が側頭部の組織を引き上げ、こめかみ周囲のたるみを改善します。',
      },
      {
        id: 'brow-lift',
        name: 'ブロウリフト',
        target: '前頭筋',
        duration: 45,
        description: '眉毛を最大挙上し、抵抗運動で前頭筋を強化します。',
        steps: [
          '両手の人差し指を眉毛の上に軽く置く',
          '指で軽い下方向の抵抗を加えながら、眉を上に持ち上げる',
          '最大挙上位で3秒キープ',
          'ゆっくり戻す',
          '12回繰り返し',
        ],
        science: '前頭筋は額の皮膚を挙上する唯一の筋。加齢で弱化すると眉毛が下垂し、上眼瞼のたるみ（dermatochalasis）を招きます。',
      },
    ],
  },
  {
    id: 'release',
    title: '下制筋リリース',
    subtitle: '引き下げる力を緩和する',
    icon: 'ArrowDown',
    color: '#f97066',
    colorLight: 'rgba(249, 112, 102, 0.15)',
    exercises: [
      {
        id: 'platysma-stretch',
        name: 'プラティズマストレッチ',
        target: '広頸筋',
        duration: 45,
        description: '広頸筋を持続的に伸長し、下顔面への牽引力を緩和します。',
        steps: [
          '背筋を伸ばし、顔を天井に向ける',
          '下唇を上に突き出す（下顎を前に出す感覚）',
          '首の前面に伸長感を感じたら30秒キープ',
          'ゆっくり戻す',
          '3回繰り返し',
        ],
        science: '広頸筋は骨に付着しない唯一の皮筋。前傾姿勢で短縮すると下顔面の組織を直接牽引し、ジョウル（顎のたるみ）やマリオネットラインの原因になります。',
      },
      {
        id: 'dao-release',
        name: 'DAOリリース',
        target: '口角下制筋',
        duration: 45,
        description: '口角下制筋の緊張を軽圧で緩和し、口角の下垂を改善します。',
        steps: [
          '口角の約1cm下に指を置く',
          '2-3gの圧（皮膚がわずかに動く程度）で円を描く',
          '1箇所10秒ずつ、左右各3セット',
          '強く押さないこと — 靭帯を傷つけます',
        ],
        science: '口角下制筋（DAO）の過活動は「への字口」の原因。この筋は下顎骨下縁から口角に走行し、収縮すると口角を引き下げます。美容外科ではボトックスの対象となる筋です。',
      },
      {
        id: 'dcf-activation',
        name: 'DCFアクティベーション',
        target: '深頸屈筋群',
        duration: 60,
        description: '深頸屈筋群を再活性化し、頸椎の安定性を回復させます。',
        steps: [
          '仰向けに寝る（枕なし推奨）',
          '顎を軽く引く（二重顎を作る感覚）',
          '後頭部で床を軽く押す',
          '首の前面の深い筋肉が働く感覚を確認',
          '10秒キープ × 8回',
        ],
        science: '深頸屈筋群（DCF）はFHP（前方頭位）で最も弱化する筋群。この筋の再活性化が姿勢改善の基盤であり、広頸筋の過緊張を根本から解消します。',
      },
    ],
  },
  {
    id: 'posture',
    title: '姿勢矯正',
    subtitle: '根本原因を断つ',
    icon: 'Spine',
    color: '#fbbf24',
    colorLight: 'rgba(251, 191, 36, 0.15)',
    exercises: [
      {
        id: 'wall-angel',
        name: 'ウォールエンジェル',
        target: '菱形筋・下部僧帽筋',
        duration: 60,
        description: '壁を使って肩甲骨の内転・下制パターンを再教育します。',
        steps: [
          '壁に背中をつけて立つ（後頭部・肩甲骨・臀部が壁に接触）',
          '腕を「W」の形に上げ、前腕を壁につける',
          '壁から離さないようにゆっくり腕を上に伸ばす',
          '元の「W」に戻す',
          '10回繰り返し',
        ],
        science: '菱形筋と下部僧帽筋は肩甲骨の内転・下制を担当。これらの弱化が円背（猫背）の主因であり、FHPの根本原因です。',
      },
      {
        id: 'chin-tuck',
        name: 'チンタック',
        target: '深頸屈筋群',
        duration: 45,
        description: '頸椎のニュートラル位を再学習する基本エクササイズ。',
        steps: [
          '座位で背筋を伸ばす',
          '顎を水平に後ろに引く（二重顎を作る感覚）',
          '頭頂部を天井に向けて伸ばすイメージ',
          '5秒キープ → リラックス',
          '10回繰り返し',
        ],
        science: 'チンタック（顎引き運動）は理学療法における頸椎安定化の基本。FHPで前方に偏位した頭部重心を正中に戻し、頸部筋群のバランスを回復させます。',
      },
      {
        id: 'thoracic-ext',
        name: '胸椎伸展ストレッチ',
        target: '胸椎モビリティ',
        duration: 60,
        description: '胸椎の可動性を改善し、猫背を根本から解消します。',
        steps: [
          'タオルを丸めて筒状にする',
          '仰向けに寝て、胸椎（肩甲骨の間）の下にタオルを横向きに置く',
          '両腕を頭の上に伸ばし、胸を開く',
          '30秒キープ → タオルの位置を少し上下にずらす',
          '3箇所で各30秒',
        ],
        science: '胸椎の後弯増強（猫背）はFHPの代償です。胸椎の伸展可動域を改善することで、頸椎が自然にニュートラルポジションに戻れる環境を作ります。',
      },
    ],
  },
]

export const dailyProgram = {
  monday: { category: 'elevation', exerciseIds: ['cheek-lift', 'brow-lift'] },
  tuesday: { category: 'release', exerciseIds: ['platysma-stretch', 'dao-release'] },
  wednesday: { category: 'posture', exerciseIds: ['wall-angel', 'chin-tuck'] },
  thursday: { category: 'elevation', exerciseIds: ['temple-press', 'cheek-lift'] },
  friday: { category: 'release', exerciseIds: ['dcf-activation', 'platysma-stretch'] },
  saturday: { category: 'posture', exerciseIds: ['thoracic-ext', 'wall-angel'] },
  sunday: null, // 回復日
}

export function getTodayProgram(diagnosis) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]

  // Sunday = rest
  if (today === 'sunday') return null

  // If no diagnosis, use default program
  if (!diagnosis || !diagnosis.completed) {
    const program = dailyProgram[today]
    if (!program) return null
    const category = trainingCategories.find(c => c.id === program.category)
    const exercises = program.exerciseIds.map(id =>
      category.exercises.find(e => e.id === id)
    ).filter(Boolean)
    return { category, exercises }
  }

  // --- Personalized program based on diagnosis ---
  // Priority logic:
  //   CMA > 125 (obtuse) -> prioritize platysma release + posture
  //   JDI < 55 (weak jawline) -> prioritize elevation exercises
  //   PostureAngle > 20 (forward head) -> prioritize posture correction
  //   Otherwise -> balanced rotation

  const { cmaAngle = 110, jdi = 60, postureAngle = 20 } = diagnosis

  // Score each category's urgency
  const urgency = {
    elevation: 0,
    release: 0,
    posture: 0,
  }

  // JDI drives elevation priority
  if (jdi < 45) urgency.elevation += 3
  else if (jdi < 55) urgency.elevation += 2
  else if (jdi < 65) urgency.elevation += 1

  // CMA drives release priority (tighter neck muscles, more release needed)
  if (cmaAngle > 135) urgency.release += 3
  else if (cmaAngle > 125) urgency.release += 2
  else if (cmaAngle > 115) urgency.release += 1

  // Posture angle drives posture priority
  if (postureAngle > 30) urgency.posture += 3
  else if (postureAngle > 20) urgency.posture += 2
  else if (postureAngle > 10) urgency.posture += 1

  // Sort categories by urgency (highest first)
  const sorted = Object.entries(urgency).sort((a, b) => b[1] - a[1])

  // Weekday rotation: pick category based on day + urgency
  const dayIndex = new Date().getDay() // 1-6 (Mon-Sat)
  const catIndex = (dayIndex - 1) % 3 // rotate through top 3

  // Reorder so highest urgency gets most days
  const selectedCatId = sorted[catIndex >= sorted.length ? 0 : catIndex][0]
  const category = trainingCategories.find(c => c.id === selectedCatId)

  if (!category) return null

  // Select exercises: prioritize based on specific weaknesses
  let selectedExercises = [...category.exercises]

  // For elevation: if JDI is very low, include all exercises
  // Otherwise pick 2
  if (selectedExercises.length > 2 && urgency[selectedCatId] < 3) {
    // Rotate which 2 exercises are shown based on day
    const startIdx = (dayIndex - 1) % selectedExercises.length
    selectedExercises = [
      selectedExercises[startIdx % selectedExercises.length],
      selectedExercises[(startIdx + 1) % selectedExercises.length],
    ]
  }

  return {
    category,
    exercises: selectedExercises,
    isPersonalized: true,
    primaryFocus: sorted[0][0],
    urgencyScores: urgency,
  }
}
