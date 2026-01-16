export const useNotifications = () => {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const registration = ref<ServiceWorkerRegistration | null>(null)
  const subscription = ref<PushSubscription | null>(null)

  const checkSupport = () => {
    isSupported.value = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  }

  const requestPermission = async () => {
    if (!isSupported.value) {
      throw new Error('Notifications are not supported')
    }

    const result = await Notification.requestPermission()
    permission.value = result
    return result
  }

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported')
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      registration.value = reg
      return reg
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      throw error
    }
  }

  const subscribeToPush = async () => {
    if (!registration.value) {
      await registerServiceWorker()
    }

    if (!registration.value) {
      throw new Error('Service Worker not registered')
    }

    const response = await $fetch<{ publicKey: string }>('/api/push/vapid-public-key')
    const publicKey = response.publicKey

    const sub = await registration.value.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(publicKey),
      userVisibleOnly: true,
    })

    subscription.value = sub

    await $fetch('/api/push/subscribe', {
      body: sub.toJSON(),
      method: 'POST',
    })

    return sub
  }

  const startPeriodicNotifications = async (intervalMinutes: number = 1) => {
    await $fetch('/api/push/start-interval', {
      body: { intervalMinutes },
      method: 'POST',
    })
  }

  const stopPeriodicNotifications = async () => {
    await $fetch('/api/push/stop-interval', {
      method: 'POST',
    })
  }

  const sendTestNotification = async () => {
    await $fetch('/api/push/send', {
      body: {
        message: 'This is a test notification from your Nuxt PWA!',
        title: 'Test Notification',
      },
      method: 'POST',
    })
  }

  return {
    checkSupport,
    isSupported,
    permission,
    registration,
    registerServiceWorker,
    requestPermission,
    sendTestNotification,
    startPeriodicNotifications,
    stopPeriodicNotifications,
    subscribeToPush,
    subscription,
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
