/**
 * FaceGravity -- Face & Posture Analysis Engine v2
 *
 * Dual-model approach:
 *   1. MediaPipe Face Mesh (468 landmarks) -- frontal face metrics
 *   2. MediaPipe BlazePose (33 landmarks)  -- side-view posture & CMA
 *
 * Measured metrics:
 *   - CMA (Cervicomental Angle): Pose ear/shoulder + Face Mesh chin
 *   - JDI (Jawline Definition Index): jaw angle sharpness & ratio
 *   - Facial Symmetry: left/right landmark distance comparison
 *   - Midface Sag Ratio: cheek descent relative to orbital rim
 *   - Forward Head Posture: ear-shoulder alignment angle
 *
 * Reference: Aesthetic Surgery Journal (CMA 105-120 ideal)
 */

let faceDetector = null
let poseDetector = null
let faceLoadPromise = null
let poseLoadPromise = null

// ============================================================
// Detector Initialization
// ============================================================

export async function loadFaceDetector() {
  if (faceDetector) return faceDetector
  if (faceLoadPromise) return faceLoadPromise

  faceLoadPromise = (async () => {
    const tf = await import('@tensorflow/tfjs')
    await tf.ready()
    const fld = await import('@tensorflow-models/face-landmarks-detection')
    faceDetector = await fld.createDetector(
      fld.SupportedModels.MediaPipeFaceMesh,
      { runtime: 'tfjs', refineLandmarks: true, maxFaces: 1 }
    )
    return faceDetector
  })()

  return faceLoadPromise
}

export async function loadPoseDetector() {
  if (poseDetector) return poseDetector
  if (poseLoadPromise) return poseLoadPromise

  poseLoadPromise = (async () => {
    const tf = await import('@tensorflow/tfjs')
    await tf.ready()
    const pd = await import('@tensorflow-models/pose-detection')
    poseDetector = await pd.createDetector(
      pd.SupportedModels.BlazePose,
      {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'full', // 'lite' | 'full' | 'heavy'
      }
    )
    return poseDetector
  })()

  return poseLoadPromise
}

// ============================================================
// Geometry Helpers
// ============================================================

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function angleDeg(a, vertex, c) {
  const va = { x: a.x - vertex.x, y: a.y - vertex.y }
  const vc = { x: c.x - vertex.x, y: c.y - vertex.y }
  const dot = va.x * vc.x + va.y * vc.y
  const mag = Math.sqrt(va.x ** 2 + va.y ** 2) * Math.sqrt(vc.x ** 2 + vc.y ** 2)
  if (mag === 0) return 0
  return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * (180 / Math.PI)
}

/** Angle of vector a->b relative to the vertical (downward = 0) */
function angleFromVertical(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.abs(Math.atan2(dx, dy) * (180 / Math.PI))
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

// ============================================================
// Face Mesh Landmark Indices (468 total)
// ============================================================
const FL = {
  foreheadCenter: 10,
  chinTip: 152,
  chinBottom: 175,
  submental: 172,
  rightEar: 234,
  leftEar: 454,
  noseTip: 1,
  noseBridge: 4,
  upperLip: 13,
  lowerLip: 14,
  rightEyeInner: 33,
  leftEyeInner: 263,
  rightEyeOuter: 133,
  leftEyeOuter: 362,
  rightMouth: 61,
  leftMouth: 291,
  rightCheek: 93,
  leftCheek: 323,
  rightJawAngle: 136,
  leftJawAngle: 365,
  rightJawUpper: 162,
  leftJawUpper: 389,
}

// ============================================================
// BlazePose Landmark Indices (33 total)
// ============================================================
const PL = {
  nose: 0,
  leftEyeInner: 1,
  leftEye: 2,
  leftEyeOuter: 3,
  rightEyeInner: 4,
  rightEye: 5,
  rightEyeOuter: 6,
  leftEar: 7,
  rightEar: 8,
  leftMouth: 9,
  rightMouth: 10,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftHip: 23,
  rightHip: 24,
}

// ============================================================
// Frontal Face Analysis (Face Mesh)
// ============================================================

export function analyzeFrontal(kp) {
  if (!kp || kp.length < 400) return null

  const forehead = kp[FL.foreheadCenter]
  const chin = kp[FL.chinTip]
  const rEar = kp[FL.rightEar]
  const lEar = kp[FL.leftEar]
  const faceH = dist(forehead, chin)
  const faceW = dist(rEar, lEar)

  // --- JDI ---
  const rJaw = kp[FL.rightJawAngle]
  const lJaw = kp[FL.leftJawAngle]
  const rAngle = angleDeg(chin, rJaw, rEar)
  const lAngle = angleDeg(chin, lJaw, lEar)
  const avgJawAngle = (rAngle + lAngle) / 2
  const jawW = dist(rJaw, lJaw)
  const jawRatio = jawW / faceW

  let jdiAngle = avgJawAngle >= 110 && avgJawAngle <= 130
    ? 100 - Math.abs(avgJawAngle - 120) * 3
    : avgJawAngle < 110
      ? 50 + (avgJawAngle - 90) * 2.5
      : Math.max(20, 100 - (avgJawAngle - 130) * 4)

  let jdiRatio = jawRatio >= 0.70 && jawRatio <= 0.90
    ? 100 - Math.abs(jawRatio - 0.80) * 500
    : Math.max(20, 60 - Math.abs(jawRatio - 0.80) * 300)

  const jdi = clamp(Math.round(jdiAngle * 0.6 + jdiRatio * 0.4), 10, 100)

  // --- Symmetry ---
  const nose = kp[FL.noseTip]
  const symPairs = [
    [kp[FL.rightEyeInner], kp[FL.leftEyeInner]],
    [kp[FL.rightMouth], kp[FL.leftMouth]],
    [rJaw, lJaw],
  ]
  const syms = symPairs.map(([r, l]) => {
    const dr = dist(nose, r)
    const dl = dist(nose, l)
    return 1 - Math.abs(dr - dl) / Math.max(dr, dl)
  })
  const symmetryScore = Math.round((syms.reduce((a, b) => a + b, 0) / syms.length) * 100)

  // --- Midface Sag ---
  const rCheek = kp[FL.rightCheek]
  const lCheek = kp[FL.leftCheek]
  const sagR = dist(rCheek, kp[FL.rightMouth]) / dist(rCheek, kp[FL.rightEyeOuter])
  const sagL = dist(lCheek, kp[FL.leftMouth]) / dist(lCheek, kp[FL.leftEyeOuter])
  const avgSag = (sagR + sagL) / 2

  let midfaceSag = avgSag <= 1.3
    ? Math.round(90 + (1.3 - avgSag) * 30)
    : avgSag <= 1.6
      ? Math.round(90 - (avgSag - 1.3) * 200)
      : Math.max(20, Math.round(30 - (avgSag - 1.6) * 50))
  midfaceSag = clamp(midfaceSag, 10, 100)

  // --- Frontal chin angle (supplemental) ---
  const chinAngle = angleDeg(rJaw, chin, lJaw)

  return {
    jdi,
    symmetryScore,
    midfaceSag,
    chinAngle: Math.round(chinAngle),
    avgJawAngle: Math.round(avgJawAngle),
    jawFaceRatio: round2(jawRatio),
    faceWidth: Math.round(faceW),
    faceHeight: Math.round(faceH),
    landmarkCount: kp.length,
  }
}

// ============================================================
// Side-View Pose Analysis (BlazePose)
// ============================================================

/**
 * Analyze posture from BlazePose landmarks on a side-view photo.
 *
 * Key measurement: Forward Head Posture (FHP) angle
 *   = angle between the ear-to-shoulder line and the vertical.
 *   Normal: 0-10 degrees. Moderate: 15-25. Severe: >30.
 *
 * BlazePose gives us ear (index 7/8), shoulder (11/12), hip (23/24).
 * In a side view, one side's landmarks are visible.
 */
export function analyzePose(poseLandmarks) {
  if (!poseLandmarks || poseLandmarks.length < 25) return null

  const lEar = poseLandmarks[PL.leftEar]
  const rEar = poseLandmarks[PL.rightEar]
  const lShoulder = poseLandmarks[PL.leftShoulder]
  const rShoulder = poseLandmarks[PL.rightShoulder]
  const nose = poseLandmarks[PL.nose]

  // Use whichever ear has higher confidence (more visible in side view)
  const ear = (lEar.score || 0) >= (rEar.score || 0) ? lEar : rEar
  const shoulder = (lShoulder.score || 0) >= (rShoulder.score || 0) ? lShoulder : rShoulder

  // FHP angle: deviation of ear from directly above shoulder
  // In perfect posture, ear is directly above shoulder (0 degrees)
  const fhpAngle = angleFromVertical(shoulder, ear)

  // Confidence check
  const avgConfidence = ((ear.score || 0) + (shoulder.score || 0)) / 2

  return {
    fhpAngle: Math.round(fhpAngle),
    earPosition: { x: ear.x, y: ear.y },
    shoulderPosition: { x: shoulder.x, y: shoulder.y },
    nosePosition: { x: nose.x, y: nose.y },
    confidence: round2(avgConfidence),
  }
}

// ============================================================
// Combined CMA Estimation (Face Mesh + Pose)
// ============================================================

/**
 * Estimate CMA from side-view photo using BOTH models.
 *
 * Strategy:
 *   Face Mesh (if face detected): chin tip, submental area positions
 *   Pose: ear position, shoulder position, nose position
 *
 * CMA = angle at the menton (chin point) between:
 *   - line from menton toward the throat/neck
 *   - line from menton toward the subnasal point
 *
 * Since we're working with photos (not X-rays), we approximate
 * the cervical point as a point below the chin, between chin and shoulder.
 */
export function estimateCMA(faceMeshKP, poseLandmarks) {
  // Try combined approach first
  if (faceMeshKP && faceMeshKP.length > 400 && poseLandmarks && poseLandmarks.length > 10) {
    const chin = faceMeshKP[FL.chinTip]
    const submental = faceMeshKP[FL.submental] || faceMeshKP[FL.chinBottom]
    const nose = faceMeshKP[FL.noseTip]

    const ear = (poseLandmarks[PL.leftEar].score || 0) >= (poseLandmarks[PL.rightEar].score || 0)
      ? poseLandmarks[PL.leftEar]
      : poseLandmarks[PL.rightEar]
    const shoulder = (poseLandmarks[PL.leftShoulder].score || 0) >= (poseLandmarks[PL.rightShoulder].score || 0)
      ? poseLandmarks[PL.leftShoulder]
      : poseLandmarks[PL.rightShoulder]

    // Cervical point estimation:
    // roughly 60% of the way from chin to shoulder, slightly behind chin
    const cervicalPoint = {
      x: chin.x + (shoulder.x - chin.x) * 0.3,
      y: chin.y + (shoulder.y - chin.y) * 0.35,
    }

    // CMA: angle at menton between nasal-menton line and menton-cervical line
    const cma = angleDeg(nose, chin, cervicalPoint)

    // Adjust to realistic range
    const adjustedCMA = clamp(Math.round(cma * 0.85 + 20), 85, 170)

    return {
      cmaAngle: adjustedCMA,
      method: 'combined',
      confidence: 0.8,
    }
  }

  // Face Mesh only fallback
  if (faceMeshKP && faceMeshKP.length > 400) {
    const chin = faceMeshKP[FL.chinTip]
    const nose = faceMeshKP[FL.noseTip]
    const submental = faceMeshKP[FL.submental] || faceMeshKP[FL.chinBottom]

    // Estimate neck direction from chin geometry + z-depth
    const neckPoint = {
      x: chin.x,
      y: chin.y + dist(chin, nose) * 0.6,
    }

    const cma = angleDeg(nose, chin, neckPoint)
    const adjustedCMA = clamp(Math.round(90 + cma * 0.5), 85, 160)

    return {
      cmaAngle: adjustedCMA,
      method: 'face_mesh_only',
      confidence: 0.5,
    }
  }

  // Pose only fallback -- rough estimate from posture
  if (poseLandmarks && poseLandmarks.length > 10) {
    const nose = poseLandmarks[PL.nose]
    const ear = (poseLandmarks[PL.leftEar].score || 0) >= (poseLandmarks[PL.rightEar].score || 0)
      ? poseLandmarks[PL.leftEar]
      : poseLandmarks[PL.rightEar]
    const shoulder = (poseLandmarks[PL.leftShoulder].score || 0) >= (poseLandmarks[PL.rightShoulder].score || 0)
      ? poseLandmarks[PL.leftShoulder]
      : poseLandmarks[PL.rightShoulder]

    // FHP correlates inversely with CMA (more forward head = larger CMA / more sag)
    const fhp = angleFromVertical(shoulder, ear)
    // Rough mapping: FHP 0 -> CMA ~105, FHP 30 -> CMA ~140
    const estCMA = clamp(Math.round(105 + fhp * 1.2), 90, 160)

    return {
      cmaAngle: estCMA,
      method: 'pose_only',
      confidence: 0.4,
    }
  }

  return null
}

// ============================================================
// Grading Functions
// ============================================================

export function getCMAGrade(angle) {
  if (angle >= 105 && angle <= 120) return { grade: 'A', label: '理想的', color: '#22c55e' }
  if ((angle >= 95 && angle < 105) || (angle > 120 && angle <= 130)) return { grade: 'B', label: '良好', color: '#86efac' }
  if ((angle >= 85 && angle < 95) || (angle > 130 && angle <= 145)) return { grade: 'C', label: '要注意', color: '#fbbf24' }
  return { grade: 'D', label: '要改善', color: '#ef4444' }
}

export function getPostureGrade(fhpAngle) {
  if (fhpAngle <= 10) return { grade: 'A', label: '良好' }
  if (fhpAngle <= 20) return { grade: 'B', label: 'やや前傾' }
  if (fhpAngle <= 30) return { grade: 'C', label: '前傾傾向' }
  return { grade: 'D', label: '要改善' }
}

// ============================================================
// Full Analysis Pipeline
// ============================================================

export async function analyzePhotos(frontPhotoDataUrl, sidePhotoDataUrl, onProgress) {
  const progress = onProgress || (() => {})

  const results = {
    frontal: null,
    side: null,
    cmaScore: 50,
    cmaGrade: 'C',
    cmaAngle: 110,
    cmaConfidence: 0,
    cmaMethod: 'none',
    jdi: 50,
    postureGrade: 'C',
    postureAngle: 20,
    symmetry: 80,
    midfaceSag: 60,
    fhpAngle: 20,
    completed: true,
    isReal: true,
    analysisDetails: {},
  }

  // --- Normalize lighting & Load models in parallel ---
  progress('画像を正規化中...')
  const [normalizedFront, normalizedSide] = await Promise.all([
    frontPhotoDataUrl ? normalizeImage(frontPhotoDataUrl).catch(() => frontPhotoDataUrl) : null,
    sidePhotoDataUrl ? normalizeImage(sidePhotoDataUrl).catch(() => sidePhotoDataUrl) : null,
  ])

  progress('AI分析エンジンを並列読み込み中...')
  const [faceDet, poseDet] = await Promise.all([
    loadFaceDetector().catch(e => { console.error('Face detector load error:', e); return null }),
    loadPoseDetector().catch(e => { console.error('Pose detector load error:', e); return null }),
  ])

  // --- Analyze frontal photo ---
  let frontFaceKP = null
  if (normalizedFront && faceDet) {
    progress('正面写真: 468点ランドマーク検出中...')
    try {
      const img = await loadImage(normalizedFront)
      const faces = await faceDet.estimateFaces(img, { flipHorizontal: false })
      if (faces && faces.length > 0) {
        frontFaceKP = faces[0].keypoints
        const frontal = analyzeFrontal(frontFaceKP)
        if (frontal) {
          results.frontal = frontal
          results.jdi = frontal.jdi
          results.symmetry = frontal.symmetryScore
          results.midfaceSag = frontal.midfaceSag
          results.analysisDetails.frontalLandmarks = frontal.landmarkCount
          results.analysisDetails.jawAngle = frontal.avgJawAngle
        }
      }
    } catch (e) {
      console.error('Frontal analysis error:', e)
    }
  }

  // --- Analyze side photo (both models) ---
  let sideFaceKP = null
  let sidePoseLM = null

  if (normalizedSide || sidePhotoDataUrl) {
    const sideImg = await loadImage(normalizedSide || sidePhotoDataUrl)

    // Face Mesh on side photo
    if (faceDet) {
      progress('横顔写真: Face Mesh で顎・頸部を解析中...')
      try {
        const faces = await faceDet.estimateFaces(sideImg, { flipHorizontal: false })
        if (faces && faces.length > 0) {
          sideFaceKP = faces[0].keypoints
        }
      } catch (e) {
        console.error('Side face mesh error:', e)
      }
    }

    // Pose on side photo
    if (poseDet) {
      progress('横顔写真: BlazePose で姿勢ランドマーク (33点) を検出中...')
      try {
        const poses = await poseDet.estimatePoses(sideImg, { flipHorizontal: false })
        if (poses && poses.length > 0) {
          sidePoseLM = poses[0].keypoints
          const poseResult = analyzePose(sidePoseLM)
          if (poseResult) {
            results.fhpAngle = poseResult.fhpAngle
            results.analysisDetails.poseConfidence = poseResult.confidence
            results.analysisDetails.fhpAngle = poseResult.fhpAngle
          }
        }
      } catch (e) {
        console.error('Side pose error:', e)
      }
    }
  }

  // --- Try dlib backend for higher accuracy (if running) ---
  let dlibResult = null
  if (sidePhotoDataUrl) {
    try {
      progress('dlib バックエンド (68点) に接続中...')
      const resp = await fetch('http://localhost:8081/api/analyze-side', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: sidePhotoDataUrl }),
        signal: AbortSignal.timeout(10000),
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data.face_detected) {
          dlibResult = data
          results.cmaAngle = Math.round(data.cma_angle)
          results.cmaMethod = 'dlib_68'
          results.cmaConfidence = 0.95
          results.analysisDetails.dlibLandmarks = data.landmarks_detected
          results.analysisDetails.dlibJawAngle = data.jaw_angle_right
          progress('dlib で高精度CMA算出完了')
        }
      }
    } catch (e) {
      // Backend not running -- fall through to browser-based estimation
      console.log('dlib backend not available, using browser-based analysis')
    }
  }

  // --- CMA Estimation (browser-based fallback) ---
  if (!dlibResult) {
    progress('ネックライン角度を算出中...')
    const cmaResult = estimateCMA(sideFaceKP || frontFaceKP, sidePoseLM)
    if (cmaResult) {
      results.cmaAngle = cmaResult.cmaAngle
      results.cmaMethod = cmaResult.method
      results.cmaConfidence = cmaResult.confidence
    } else if (results.frontal) {
      const proxy = clamp(Math.round(90 + results.frontal.chinAngle * 0.25), 90, 150)
      results.cmaAngle = proxy
      results.cmaMethod = 'frontal_proxy'
      results.cmaConfidence = 0.3
    }
  }

  // --- Compute grades ---
  progress('グレードを判定中...')
  const cmaInfo = getCMAGrade(results.cmaAngle)
  results.cmaGrade = cmaInfo.grade
  results.cmaScore = clamp(
    Math.round(
      results.cmaAngle >= 105 && results.cmaAngle <= 120
        ? 80 + (20 - Math.abs(results.cmaAngle - 112.5) * 1.5)
        : Math.max(20, 70 - Math.abs(results.cmaAngle - 112.5) * 1.2)
    ),
    10, 100
  )

  // Posture grade from actual FHP angle (if available) or from midface/symmetry
  const postureInfo = getPostureGrade(results.fhpAngle)
  results.postureGrade = postureInfo.grade
  results.postureAngle = results.fhpAngle

  return results
}

// ============================================================
// Utility
// ============================================================

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
function round2(v) { return Math.round(v * 100) / 100 }

// ============================================================
// Image Lighting Normalization
// Adjusts brightness/contrast for consistent analysis
// ============================================================

function normalizeImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data } = imageData

      // Calculate average luminance
      let totalLum = 0
      const pixelCount = data.length / 4
      for (let i = 0; i < data.length; i += 4) {
        totalLum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      }
      const avgLum = totalLum / pixelCount

      // Target luminance: 128 (mid-gray)
      const targetLum = 128
      const brightnessFactor = targetLum / Math.max(avgLum, 1)

      // Only apply if significantly off (>15% deviation)
      if (Math.abs(brightnessFactor - 1.0) < 0.15) {
        resolve(dataUrl) // Close enough, no adjustment needed
        return
      }

      // Clamp adjustment to avoid extreme corrections
      const factor = Math.max(0.5, Math.min(1.8, brightnessFactor))

      // Calculate std dev for contrast normalization
      let totalVar = 0
      for (let i = 0; i < data.length; i += 4) {
        const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        totalVar += (lum - avgLum) ** 2
      }
      const stdDev = Math.sqrt(totalVar / pixelCount)
      const targetStd = 50
      const contrastFactor = stdDev > 10 ? Math.max(0.7, Math.min(1.5, targetStd / stdDev)) : 1.0

      // Apply combined brightness + contrast adjustment
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          let v = data[i + c]
          // Contrast: stretch around mean
          v = (v - avgLum) * contrastFactor + avgLum
          // Brightness: scale toward target
          v = v * factor
          data[i + c] = Math.max(0, Math.min(255, Math.round(v)))
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

export function getDemoResults() {
  return {
    cmaScore: 68,
    cmaGrade: 'C',
    cmaAngle: 125,
    cmaConfidence: 0,
    cmaMethod: 'demo',
    jdi: 58,
    postureGrade: 'C',
    postureAngle: 24,
    symmetry: 82,
    midfaceSag: 55,
    fhpAngle: 24,
    completed: true,
    isReal: false,
  }
}
