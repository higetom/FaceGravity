import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, RotateCcw, ChevronRight, CheckCircle2, AlertTriangle, SkipForward } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { analyzePhotos, getDemoResults } from '../lib/faceAnalysis'

// ---- Face Calibration Guide ----
// Detects face position/size in real-time to guide the user to optimal framing
function useFaceCalibration(videoRef, cameraReady, step) {
  const [calibration, setCalibration] = useState({
    distance: 'unknown',   // 'too_close' | 'too_far' | 'good'
    alignment: 'unknown',  // 'too_left' | 'too_right' | 'too_high' | 'too_low' | 'good'
    isReady: false,
    faceDetected: false,
  })
  const detectorRef = useRef(null)
  const animFrameRef = useRef(null)
  const readyCountRef = useRef(0)

  useEffect(() => {
    if (!cameraReady || (step !== 0 && step !== 2)) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    let running = true

    async function initDetector() {
      // Use a lightweight canvas-based face detection via simple brightness/skin detection
      // For real-time guide, we use the video element and a small offscreen canvas
      const canvas = document.createElement('canvas')
      canvas.width = 160
      canvas.height = 120
      detectorRef.current = canvas
      runDetection()
    }

    function runDetection() {
      if (!running) return
      const video = videoRef.current
      const canvas = detectorRef.current
      if (!video || !canvas || video.paused || video.videoWidth === 0) {
        animFrameRef.current = requestAnimationFrame(runDetection)
        return
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data, width, height } = imageData

      // Simple skin-tone detection to find face region
      let minX = width, maxX = 0, minY = height, maxY = 0
      let skinPixels = 0

      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const i = (y * width + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2]
          // Skin tone heuristic (works for variety of skin tones)
          if (r > 60 && g > 40 && b > 20 &&
              r > g && r > b &&
              (r - g) > 10 && (r - b) > 10 &&
              Math.abs(r - g) < 120 &&
              r < 250 && g < 230 && b < 210) {
            skinPixels++
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
      }

      const totalPixels = (width * height) / 4 // sampling every 2nd pixel
      const skinRatio = skinPixels / totalPixels

      if (skinRatio < 0.03 || skinPixels < 50) {
        // No face detected
        readyCountRef.current = 0
        setCalibration({
          distance: 'unknown',
          alignment: 'unknown',
          isReady: false,
          faceDetected: false,
        })
      } else {
        const faceW = maxX - minX
        const faceH = maxY - minY
        const faceCenterX = (minX + maxX) / 2
        const faceCenterY = (minY + maxY) / 2
        const faceRatio = faceH / height

        // Distance check based on face height relative to frame
        let distance = 'good'
        if (faceRatio > 0.85) distance = 'too_close'
        else if (faceRatio < 0.3) distance = 'too_far'

        // Alignment check (mirrored video, so flip X)
        let alignment = 'good'
        const cx = faceCenterX / width
        const cy = faceCenterY / height
        if (cx < 0.3) alignment = 'too_right'     // mirrored
        else if (cx > 0.7) alignment = 'too_left'  // mirrored
        else if (cy < 0.25) alignment = 'too_high'
        else if (cy > 0.7) alignment = 'too_low'

        const isGoodNow = distance === 'good' && alignment === 'good'
        if (isGoodNow) {
          readyCountRef.current = Math.min(readyCountRef.current + 1, 15)
        } else {
          readyCountRef.current = Math.max(readyCountRef.current - 2, 0)
        }

        setCalibration({
          distance,
          alignment,
          isReady: readyCountRef.current >= 10,
          faceDetected: true,
        })
      }

      animFrameRef.current = requestAnimationFrame(runDetection)
    }

    initDetector()
    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cameraReady, step, videoRef])

  return calibration
}

// Calibration overlay UI component
function CalibrationOverlay({ calibration, step }) {
  if (!calibration.faceDetected) {
    return (
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400/30 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-400 text-xs font-medium">顔を検出中...</span>
        </span>
      </div>
    )
  }

  const messages = []
  if (calibration.distance === 'too_close') messages.push('少し離れてください')
  if (calibration.distance === 'too_far') messages.push('もう少し近づいてください')
  if (calibration.alignment === 'too_left') messages.push('少し右へ')
  if (calibration.alignment === 'too_right') messages.push('少し左へ')
  if (calibration.alignment === 'too_high') messages.push('少し下へ')
  if (calibration.alignment === 'too_low') messages.push('少し上へ')

  const isGood = calibration.isReady

  return (
    <>
      {/* Position/distance status badge */}
      <div className="absolute top-3 right-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border ${
          isGood
            ? 'bg-green-500/20 border-green-400/30'
            : 'bg-orange-500/20 border-orange-400/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isGood ? 'bg-green-400' : 'bg-orange-400 animate-pulse'}`} />
          <span className={`text-xs font-medium ${isGood ? 'text-green-400' : 'text-orange-400'}`}>
            {isGood ? '撮影OK' : messages[0] || '位置を調整中'}
          </span>
        </span>
      </div>

      {/* Face oval guide (for frontal) */}
      {step === 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse cx="50" cy="42" rx="18" ry="26"
            fill="none"
            stroke={isGood ? '#22c55e' : '#fb923c'}
            strokeWidth="0.5"
            strokeDasharray={isGood ? 'none' : '2 2'}
            opacity={isGood ? 0.6 : 0.4}
          />
        </svg>
      )}

      {/* Side profile guide line (for lateral) */}
      {step === 2 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 55,15 Q 55,25 50,35 Q 46,42 45,48 Q 44,55 47,60 Q 50,64 50,68"
            fill="none"
            stroke={isGood ? '#22c55e' : '#fb923c'}
            strokeWidth="0.5"
            strokeDasharray={isGood ? 'none' : '2 2'}
            opacity={isGood ? 0.6 : 0.4}
          />
        </svg>
      )}
    </>
  )
}

export default function Diagnosis() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [step, setStep] = useState(0)
  const [frontPhoto, setFrontPhoto] = useState(null)
  const [sidePhoto, setSidePhoto] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [debugInfo, setDebugInfo] = useState('')

  // Real-time face calibration
  const calibration = useFaceCalibration(videoRef, cameraReady, step)

  // Start camera with detailed debugging
  async function openCamera() {
    try {
      setCameraError(null)
      setCameraReady(false)
      setDebugInfo('カメラ起動中...')

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('このブラウザはカメラに対応していません。Safari または Chrome をお試しください。')
        setDebugInfo('getUserMedia not available')
        return
      }

      setDebugInfo('カメラ権限をリクエスト中...')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })

      setDebugInfo(`ストリーム取得成功 - tracks: ${stream.getVideoTracks().length}`)
      streamRef.current = stream

      // Log track info
      const track = stream.getVideoTracks()[0]
      if (track) {
        const settings = track.getSettings()
        setDebugInfo(`カメラ: ${track.label} (${settings.width}x${settings.height})`)
      }

      // Wait for video element to appear in DOM (AnimatePresence transition)
      let video = videoRef.current
      if (!video) {
        for (let attempt = 0; attempt < 15; attempt++) {
          await new Promise(r => setTimeout(r, 100))
          video = videoRef.current
          if (video) break
        }
      }
      if (!video) {
        setDebugInfo('Error: video element not found')
        setCameraError('カメラ表示エラーが発生しました。ページを更新してください。')
        return
      }

      // Set the stream
      video.srcObject = stream

      // Wait for metadata to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve()
        video.onerror = (e) => reject(e)
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error('metadata timeout')), 5000)
      })

      setDebugInfo(`メタデータ読込完了 (${video.videoWidth}x${video.videoHeight})`)

      // Play the video
      await video.play()

      setDebugInfo(`再生開始! (${video.videoWidth}x${video.videoHeight})`)
      setCameraReady(true)

    } catch (err) {
      console.error('Camera error:', err)
      const errName = err.name || ''
      const errMsg = err.message || ''

      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraError('カメラへのアクセスが拒否されました。\n\nSafariの場合: 設定 → Webサイト → カメラ → localhost を「許可」に変更してください。')
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraError('カメラが見つかりません。\n\nSidecar接続中の場合は一度接続を解除してみてください。')
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        setCameraError('カメラが他のアプリで使用中か、アクセスできません。\n\n他のカメラを使用するアプリを閉じてからお試しください。')
      } else if (errName === 'OverconstrainedError') {
        setCameraError('カメラの要求条件を満たせません。再試行します...')
        // Retry with minimal constraints
        tryFallbackCamera()
        return
      } else if (errMsg.includes('timeout')) {
        setCameraError('カメラの起動がタイムアウトしました。再試行してください。')
      } else {
        setCameraError(`カメラエラー: ${errName || errMsg}`)
      }
      setDebugInfo(`Error: ${errName} - ${errMsg}`)
    }
  }

  // Fallback with minimal constraints
  async function tryFallbackCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await new Promise(r => { video.onloadedmetadata = r })
        await video.play()
        setCameraReady(true)
        setCameraError(null)
        setDebugInfo('フォールバックカメラで起動成功')
      }
    } catch (e) {
      setCameraError('カメラを起動できませんでした。「スキップ」ボタンでデモ結果をご覧いただけます。')
      setDebugInfo(`Fallback also failed: ${e.name}`)
    }
  }

  // Stop camera
  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraReady(false)
  }

  // Open camera on mount
  useEffect(() => {
    openCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Also open camera when transitioning to step 2
  useEffect(() => {
    if (step === 2) {
      openCamera()
    }
  }, [step])

  // Capture photo
  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return null
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  function handleCaptureFront() {
    const photo = capturePhoto()
    if (photo) {
      setFrontPhoto(photo)
      closeCamera()
      setStep(1)
    }
  }

  function handleCaptureSide() {
    const photo = capturePhoto()
    if (photo) {
      setSidePhoto(photo)
      closeCamera()
      setStep(3)
    }
  }

  function handleRetake() {
    if (step === 1) { setFrontPhoto(null); setStep(0); openCamera() }
    if (step === 3) { setSidePhoto(null); setStep(2); openCamera() }
  }

  function handleNextToSide() {
    setStep(2)
  }

  function handleStartAnalysis() {
    setStep(4)
  }

  const [analysisProgress, setAnalysisProgress] = useState('')
  const [isDemo, setIsDemo] = useState(false)

  // Skip camera entirely — go straight to analysis with demo data
  function handleSkipToDemo() {
    setIsDemo(true)
    setStep(4)
  }

  // Real analysis using TensorFlow.js + MediaPipe Face Mesh
  useEffect(() => {
    if (step !== 4) return
    closeCamera()

    let cancelled = false

    async function runAnalysis() {
      try {
        if (isDemo || (!frontPhoto && !sidePhoto)) {
          // Demo mode — use preset values
          setAnalysisProgress('デモデータを生成中...')
          await new Promise(r => setTimeout(r, 3000))
          if (cancelled) return
          const demo = getDemoResults()
          dispatch({ type: 'SET_DIAGNOSIS', payload: demo })
          dispatch({ type: 'SAVE_SCAN', payload: demo })
          navigate('/diagnosis-result')
          return
        }

        // Real analysis with progress callback
        const results = await analyzePhotos(frontPhoto, sidePhoto, (msg) => {
          if (!cancelled) setAnalysisProgress(msg)
        })
        if (cancelled) return

        setAnalysisProgress('分析完了')
        await new Promise(r => setTimeout(r, 500))
        if (cancelled) return

        dispatch({ type: 'SET_DIAGNOSIS', payload: results })
        dispatch({ type: 'SAVE_SCAN', payload: { ...results, frontPhoto, sidePhoto } })
        navigate('/diagnosis-result')
      } catch (err) {
        console.error('Analysis error:', err)
        setAnalysisProgress('分析中にエラーが発生。デモ結果を表示します...')
        await new Promise(r => setTimeout(r, 1500))
        if (cancelled) return
        const demo = getDemoResults()
        dispatch({ type: 'SET_DIAGNOSIS', payload: demo })
        navigate('/diagnosis-result')
      }
    }

    runAnalysis()
    return () => { cancelled = true }
  }, [step])

  const analysisTerms = [
    'Face Mesh 468点 + BlazePose 33点 検出',
    '頤頸角 (CMA) 算出',
    'ジョーライン定義指数 (JDI) 算出',
    'Forward Head Posture 角度測定',
  ]

  return (
    <div className="mobile-container bg-dark-950 min-h-screen flex flex-col">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">顔スキャン診断</h1>
        <p className="text-white/60 text-sm mt-1">
          {step === 0 && '正面写真を撮影してください'}
          {step === 1 && '正面写真 — 確認'}
          {step === 2 && '横顔写真を撮影してください'}
          {step === 3 && '横顔写真 — 確認'}
          {step === 4 && 'AI分析中...'}
        </p>
        <div className="flex gap-1.5 mt-4">
          {['正面撮影', '横顔撮影', 'AI分析'].map((label, i) => {
            const g = step <= 1 ? 0 : step <= 3 ? 1 : 2
            return (
              <div key={i} className="flex-1">
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      background: 'linear-gradient(90deg, #22c55e, #2dd4bf)',
                      width: i < g ? '100%' : i === g ? '50%' : '0%',
                    }}
                  />
                </div>
                <p className={`text-[10px] mt-1 ${i <= g ? 'text-green-400' : 'text-white/30'}`}>{label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 pb-4 min-h-0">
        <AnimatePresence mode="wait">

          {/* ===== CAMERA VIEW ===== */}
          {(step === 0 || step === 2) && (
            <motion.div key={`cam-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4 min-h-0"
            >
              <div className="flex-1 relative rounded-3xl overflow-hidden bg-black" style={{ minHeight: 280 }}>
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle className="w-10 h-10 text-yellow-400 mb-3" />
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{cameraError}</p>
                    <div className="flex gap-3 mt-5">
                      <button onClick={openCamera}
                        className="px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-medium">
                        再試行
                      </button>
                      <button onClick={handleSkipToDemo}
                        className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white/70 text-sm font-medium flex items-center gap-1.5">
                        <SkipForward className="w-3.5 h-3.5" />
                        スキップ
                      </button>
                    </div>
                    {debugInfo && (
                      <p className="text-white/30 text-[10px] mt-4 font-mono">{debugInfo}</p>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Video feed */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ transform: 'scaleX(-1)' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay: guide frame + scanning */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-6 border-2 border-green-400/30 rounded-2xl" />
                      {['top-4 left-4 border-t-2 border-l-2 rounded-tl-lg',
                        'top-4 right-4 border-t-2 border-r-2 rounded-tr-lg',
                        'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg',
                        'bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg',
                      ].map((c, i) => (
                        <div key={i} className={`absolute w-6 h-6 border-green-400 ${c}`}
                          style={{ animation: `pulse 2s ease-in-out ${i * 0.15}s infinite` }} />
                      ))}
                      {/* Scan line */}
                      <div className="absolute inset-x-6 h-px animate-scan"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)',
                          boxShadow: '0 0 12px #22c55e',
                          animation: 'scanMove 3s linear infinite',
                        }}
                      />
                    </div>

                    {/* Guide text */}
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className={`inline-block px-4 py-1.5 rounded-full backdrop-blur text-sm transition-colors ${
                        calibration.isReady ? 'bg-green-500/30 text-green-300' : 'bg-black/60 text-white'
                      }`}>
                        {calibration.isReady
                          ? 'シャッターを押してください'
                          : step === 0
                            ? '枠内に顔を合わせてください'
                            : '横顔を枠に合わせてください'}
                      </span>
                    </div>

                    {/* Camera ready indicator */}
                    {cameraReady && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-green-400 text-xs">LIVE</span>
                        </span>
                      </div>
                    )}

                    {/* Calibration guide overlay */}
                    {cameraReady && <CalibrationOverlay calibration={calibration} step={step} />}

                    {/* Loading / not ready yet */}
                    {!cameraReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-green-400 animate-spin mb-3" />
                        <p className="text-white/60 text-sm">カメラ起動中...</p>
                        {debugInfo && (
                          <p className="text-white/30 text-[10px] mt-2 font-mono px-6 text-center">{debugInfo}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Shutter + Skip */}
              <div className="flex items-center justify-center gap-6 py-2">
                <button onClick={handleSkipToDemo}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white/60 transition"
                  title="スキップ">
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={step === 0 ? handleCaptureFront : handleCaptureSide}
                  disabled={!cameraReady}
                  className={`w-[72px] h-[72px] rounded-full border-[3px] flex items-center justify-center transition active:scale-90 disabled:opacity-30 ${
                    calibration.isReady ? 'border-green-400' : 'border-white'
                  }`}
                  style={calibration.isReady ? { boxShadow: '0 0 20px rgba(34,197,94,0.4)' } : {}}
                >
                  <div className="w-[60px] h-[60px] rounded-full"
                    style={{ background: cameraReady ? 'linear-gradient(135deg, #22c55e, #2dd4bf)' : '#333' }} />
                </button>
                <div className="w-11" /> {/* spacer for centering */}
              </div>
            </motion.div>
          )}

          {/* ===== REVIEW VIEW ===== */}
          {(step === 1 || step === 3) && (
            <motion.div key={`rev-${step}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4 min-h-0"
            >
              <div className="flex-1 relative rounded-3xl overflow-hidden bg-black" style={{ minHeight: 280 }}>
                <img src={step === 1 ? frontPhoto : sidePhoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 inset-x-3 flex justify-center">
                  <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur border border-green-400/30">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      {step === 1 ? '正面写真OK' : '横顔写真OK'}
                    </span>
                  </motion.span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleRetake}
                  className="flex-1 py-3.5 rounded-2xl border border-white/20 text-white/70 font-semibold active:scale-[0.98] transition">
                  撮り直す
                </button>
                <button onClick={step === 1 ? handleNextToSide : handleStartAnalysis}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-white active:scale-[0.98] transition flex items-center justify-center gap-1"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
                  {step === 1 ? <>横顔へ <ChevronRight className="w-4 h-4" /></> : '分析を開始'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== ANALYSIS ===== */}
          {step === 4 && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5"
            >
              {(frontPhoto || sidePhoto) && (
                <div className="flex gap-3 mb-2">
                  {frontPhoto && <div className="w-16 h-22 rounded-lg overflow-hidden border border-green-400/20">
                    <img src={frontPhoto} alt="" className="w-full h-full object-cover" /></div>}
                  {sidePhoto && <div className="w-16 h-22 rounded-lg overflow-hidden border border-green-400/20">
                    <img src={sidePhoto} alt="" className="w-full h-full object-cover" /></div>}
                </div>
              )}

              <div className="relative w-28 h-28">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 border-r-green-400/50" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border-2 border-transparent border-b-green-400 border-l-green-400/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ scale: [0.85, 1.1, 0.85] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Camera className="w-8 h-8 text-green-400" />
                  </motion.div>
                </div>
              </div>

              {analysisProgress && (
                <p className="text-white/60 text-sm">{analysisProgress}</p>
              )}

              <div className="w-full max-w-xs">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }}
                    transition={{ duration: 8, ease: 'easeInOut' }}
                    className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e, #2dd4bf)' }} />
                </div>
              </div>

              <div className="w-full space-y-2">
                {analysisTerms.map((term, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1.2, duration: 0.3 }}
                    className="flex items-center gap-3 px-4 py-2.5 glass-card">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 rounded-full border-2 border-transparent border-t-green-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{term}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scanMove {
          0% { top: 24px; }
          50% { top: calc(100% - 24px); }
          100% { top: 24px; }
        }
      `}</style>
    </div>
  )
}
