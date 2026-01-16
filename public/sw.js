self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Nuxt PWA Notification'
  const options = {
    badge: '/icons/icon-192x192.svg',
    body: data.body || 'You have a new notification!',
    data: {
      dateOfArrival: Date.now(),
      timestamp: data.timestamp || Date.now(),
    },
    icon: '/icons/icon-192x192.svg',
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})
