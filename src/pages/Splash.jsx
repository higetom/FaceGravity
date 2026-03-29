import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding')
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="mobile-container bg-dark-950 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo - Animated Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="relative w-28 h-28"
        >
          <div className="absolute inset-0 gradient-brand rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute inset-0 gradient-brand rounded-full opacity-40 blur-xl"></div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-2 border-2 border-emerald-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1.05, 1, 1.05] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-4 border border-teal-400 rounded-full opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl font-bold gradient-text"
            >
              ↑
            </motion.div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black gradient-text mb-3">FaceGravity</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/60 font-light tracking-wide"
          >
            姿勢を変えたら、
            <br />
            顔が変わった。
          </motion.p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-32 h-32 gradient-brand rounded-full opacity-10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-10 w-40 h-40 gradient-brand rounded-full opacity-10 blur-3xl"
        />
      </div>
    </div>
  )
}
