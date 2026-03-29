import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Diagnosis from './pages/Diagnosis'
import DiagnosisResult from './pages/DiagnosisResult'
import Home from './pages/Home'
import Training from './pages/Training'
import Lesson from './pages/Lesson'
import Progress from './pages/Progress'
import Premium from './pages/Premium'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'
import { AppProvider, useApp } from './context/AppContext'
import { startNotificationScheduler, stopNotificationScheduler } from './lib/notifications'

function AppContent() {
  const location = useLocation()
  const { state } = useApp()
  const hideNav = ['/', '/onboarding', '/diagnosis', '/diagnosis-result', '/premium'].includes(location.pathname)

  // Start notification scheduler
  useEffect(() => {
    startNotificationScheduler(() => state.training?.todayDone || false)
    return () => stopNotificationScheduler()
  }, [state.training?.todayDone])

  return (
    <div className="mobile-container bg-dark-950">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/diagnosis-result" element={<DiagnosisResult />} />
          <Route path="/home" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
