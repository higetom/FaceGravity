import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Dumbbell, BarChart3, User } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'training', label: 'Training', icon: Dumbbell, path: '/training' },
    { id: 'progress', label: 'Progress', icon: BarChart3, path: '/progress' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto"
    >
      <div className="glass rounded-t-3xl px-6 py-2 pb-2 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = isActive(tab.path)

            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon
                    size={24}
                    className={`transition-colors duration-300 ${
                      active ? 'text-green-500' : 'text-slate-500'
                    }`}
                  />
                  {active && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    active ? 'text-green-500' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
