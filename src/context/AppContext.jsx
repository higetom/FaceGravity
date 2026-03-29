import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()
const STORAGE_KEY = 'facegravity_state'

// ============================================================
// Initial State
// ============================================================
const initialState = {
  user: {
    name: '',
    age: '',
    gender: '',
    concern: '',
    deskHours: '',
  },
  diagnosis: {
    cmaScore: null,
    cmaGrade: null,
    cmaAngle: null,
    jdi: null,
    postureGrade: null,
    postureAngle: null,
    symmetry: null,
    midfaceSag: null,
    isReal: false,
    completed: false,
  },
  // Scan history for before/after comparison
  scanHistory: [],
  streak: {
    current: 0,
    longest: 0,
    lastDate: null,
    history: [],
  },
  training: {
    todayCompleted: [],
    totalSessions: 0,
    weeklyGoal: 5,
    weeklyDone: 0,
  },
  lessons: {
    completed: [],
    current: 0,
  },
  scores: {
    history: [],
  },
  isPremium: false,
}

// ============================================================
// LocalStorage Persistence
// ============================================================
function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)

    // Streak day-check: if lastDate is not today and not yesterday, reset streak
    if (saved.streak && saved.streak.lastDate) {
      const last = new Date(saved.streak.lastDate)
      const now = new Date()
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))
      if (diffDays > 1) {
        // Streak broken
        saved.streak.current = 0
      }
    }

    // Reset daily training if date changed
    if (saved.training && saved.streak && saved.streak.lastDate) {
      const lastTrainDate = saved.streak.lastDate
      const today = new Date().toDateString()
      if (lastTrainDate !== today) {
        saved.training.todayCompleted = []
      }
    }

    // Reset weekly stats on Monday
    const now = new Date()
    if (now.getDay() === 1 && saved.training) {
      const lastDate = saved.streak?.lastDate ? new Date(saved.streak.lastDate) : null
      if (lastDate && lastDate.getDay() !== 1) {
        saved.training.weeklyDone = 0
      }
    }

    return saved
  } catch (e) {
    console.error('Failed to load saved state:', e)
    return null
  }
}

function saveState(state) {
  try {
    // Don't persist scan photos in localStorage (too large)
    // Store only metadata in scanHistory
    const toSave = {
      ...state,
      scanHistory: state.scanHistory.map(scan => ({
        ...scan,
        frontPhoto: scan.frontPhoto ? '[saved]' : null,
        sidePhoto: scan.sidePhoto ? '[saved]' : null,
      })),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

// Separate storage for scan photos (IndexedDB for large blobs)
const PHOTO_DB = 'facegravity_photos'
const PHOTO_STORE = 'scans'

function openPhotoDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTO_DB, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(PHOTO_STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveScanPhotos(scanId, frontPhoto, sidePhoto) {
  try {
    const db = await openPhotoDB()
    const tx = db.transaction(PHOTO_STORE, 'readwrite')
    tx.objectStore(PHOTO_STORE).put({ id: scanId, frontPhoto, sidePhoto })
    await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej })
  } catch (e) {
    console.error('Failed to save scan photos:', e)
  }
}

async function loadScanPhotos(scanId) {
  try {
    const db = await openPhotoDB()
    const tx = db.transaction(PHOTO_STORE, 'readonly')
    const req = tx.objectStore(PHOTO_STORE).get(scanId)
    return new Promise((res) => {
      req.onsuccess = () => res(req.result || null)
      req.onerror = () => res(null)
    })
  } catch (e) {
    return null
  }
}

// Export for use in components
export { saveScanPhotos, loadScanPhotos }

// ============================================================
// Reducer
// ============================================================
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } }

    case 'SET_DIAGNOSIS':
      return { ...state, diagnosis: { ...state.diagnosis, ...action.payload } }

    case 'SAVE_SCAN': {
      // Add a scan to history for before/after tracking
      const scan = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        cmaAngle: action.payload.cmaAngle,
        cmaGrade: action.payload.cmaGrade,
        jdi: action.payload.jdi,
        postureGrade: action.payload.postureGrade,
        postureAngle: action.payload.postureAngle,
        symmetry: action.payload.symmetry,
        midfaceSag: action.payload.midfaceSag,
        cmaMethod: action.payload.cmaMethod,
        isReal: action.payload.isReal,
      }
      // Save photos to IndexedDB (async, fire and forget)
      if (action.payload.frontPhoto || action.payload.sidePhoto) {
        saveScanPhotos(scan.id, action.payload.frontPhoto, action.payload.sidePhoto)
      }
      return {
        ...state,
        scanHistory: [...state.scanHistory, scan],
      }
    }

    case 'COMPLETE_TRAINING': {
      const today = new Date().toDateString()
      const newCompleted = [...state.training.todayCompleted, action.payload]
      const isNewDay = state.streak.lastDate !== today
      const newStreak = isNewDay ? state.streak.current + 1 : state.streak.current
      return {
        ...state,
        training: {
          ...state.training,
          todayCompleted: newCompleted,
          totalSessions: state.training.totalSessions + 1,
          weeklyDone: state.training.weeklyDone + 1,
        },
        streak: {
          ...state.streak,
          current: newStreak,
          longest: Math.max(newStreak, state.streak.longest),
          lastDate: today,
          history: [...state.streak.history, today],
        },
      }
    }

    case 'COMPLETE_LESSON':
      return {
        ...state,
        lessons: {
          ...state.lessons,
          completed: [...state.lessons.completed, action.payload],
          current: state.lessons.current + 1,
        },
      }

    case 'ADD_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          history: [...state.scores.history, action.payload],
        },
      }

    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload }

    case 'LOAD_STATE':
      return { ...state, ...action.payload }

    case 'RESET_ALL':
      localStorage.removeItem(STORAGE_KEY)
      return { ...initialState }

    default:
      return state
  }
}

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }) {
  const saved = loadSavedState()
  const mergedInitial = saved
    ? { ...initialState, ...saved, scanHistory: saved.scanHistory || [] }
    : initialState

  const [state, dispatch] = useReducer(reducer, mergedInitial)

  // Auto-save on every state change
  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
