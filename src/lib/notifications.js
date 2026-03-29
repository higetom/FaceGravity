// ============================================================
// Notification Reminders for FaceGravity
// Uses Notification API + localStorage scheduling
// ============================================================

const NOTIFICATION_KEY = 'facegravity_notification_prefs'

const defaultPrefs = {
  enabled: false,
  time: '21:00', // Default reminder at 9 PM
  permissionGranted: false,
}

export function getNotificationPrefs() {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY)
    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

export function saveNotificationPrefs(prefs) {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(prefs))
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { supported: false, granted: false }
  }

  if (Notification.permission === 'granted') {
    return { supported: true, granted: true }
  }

  if (Notification.permission === 'denied') {
    return { supported: true, granted: false, denied: true }
  }

  const result = await Notification.requestPermission()
  return { supported: true, granted: result === 'granted' }
}

// Messages rotate for variety
const reminderMessages = [
  { title: 'FaceGravity', body: '今日のトレーニングがまだです。5分で完了できます!' },
  { title: 'FaceGravity', body: '連続記録を途切れさせないで! 今日もトレーニングしましょう' },
  { title: 'FaceGravity', body: '姿勢とフェイスラインの改善は毎日の積み重ねです' },
  { title: 'FaceGravity', body: 'たった5分の投資で、1週間後の自分が変わります' },
  { title: 'FaceGravity', body: '今日のエクササイズが待っています。始めましょう!' },
]

export function getRandomMessage() {
  return reminderMessages[Math.floor(Math.random() * reminderMessages.length)]
}

export function showNotification() {
  if (Notification.permission !== 'granted') return

  const msg = getRandomMessage()
  try {
    const notification = new Notification(msg.title, {
      body: msg.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'facegravity-reminder',
      renotify: true,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  } catch {
    // SW notification fallback
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(msg.title, {
          body: msg.body,
          icon: '/icon-192.png',
          tag: 'facegravity-reminder',
        })
      })
    }
  }
}

// Check if we should show a reminder right now
// Called periodically from the app
let lastCheckDate = null

export function checkAndNotify(hasTrainedToday) {
  if (hasTrainedToday) return // Already trained

  const prefs = getNotificationPrefs()
  if (!prefs.enabled) return

  const now = new Date()
  const todayKey = now.toDateString()
  if (lastCheckDate === todayKey) return // Already checked today

  const [hours, minutes] = prefs.time.split(':').map(Number)
  if (now.getHours() >= hours && now.getMinutes() >= minutes) {
    lastCheckDate = todayKey
    showNotification()
  }
}

// Setup periodic check (runs every 5 minutes when app is open)
let checkInterval = null

export function startNotificationScheduler(getHasTrainedToday) {
  if (checkInterval) clearInterval(checkInterval)

  checkInterval = setInterval(() => {
    checkAndNotify(getHasTrainedToday())
  }, 5 * 60 * 1000) // Check every 5 minutes

  // Also check immediately
  checkAndNotify(getHasTrainedToday())
}

export function stopNotificationScheduler() {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}
