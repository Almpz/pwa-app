import type { Ref } from 'vue'

export {}

declare global {
  const useNotifications: () => {
    checkSupport: () => void
    isSupported: Ref<boolean>
    permission: Ref<NotificationPermission>
    registration: Ref<ServiceWorkerRegistration | null>
    registerServiceWorker: () => Promise<ServiceWorkerRegistration>
    requestPermission: () => Promise<NotificationPermission>
    sendNotification: (title: string, body: string) => Promise<void>
    startPeriodicNotifications: (intervalMinutes?: number) => number
    stopPeriodicNotifications: (intervalId: number) => void
  }
}
