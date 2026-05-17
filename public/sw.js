const CACHE = 'iglesia-bv-v4'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const { request } = event
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
    return
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => cached)
      return cached || fetchPromise
    })
  )
})

self.addEventListener('push', (event) => {
  let data = { title: 'Barrio Buenaventura', body: '', url: '/' }
  try {
    if (event.data) {
      data = JSON.parse(event.data.text())
    }
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icono-barrio-sin fondo.svg',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url === url)
      if (existing) {
        existing.focus()
      } else {
        clients.openWindow(url)
      }
    })
  )
})

const reminderTimers = {}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDER') {
    const { id, nombre, fecha_hora, ahora } = event.data
    const eventTime = new Date(fecha_hora).getTime()
    const reminderTime = eventTime - 5 * 60 * 1000
    const delay = reminderTime - (ahora || Date.now())
    if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
      if (reminderTimers[id]) clearTimeout(reminderTimers[id])
      reminderTimers[id] = setTimeout(() => {
        self.registration.showNotification('Recordatorio', {
          body: `"${nombre}" comienza en 5 minutos`,
          icon: '/icono-barrio-sin fondo.svg',
          badge: '/icon-192.png',
          data: { url: '/' },
          vibrate: [100, 50, 100],
          tag: 'reminder-' + id,
        })
        delete reminderTimers[id]
      }, delay)
    }
  }
})
