<template>
  <div class="container">
    <NuxtRouteAnnouncer />
    <div class="content">
      <h1>Nuxt PWA with Push Notifications</h1>
      
      <div class="notification-controls">
        <div v-if="!notificationSupported" class="alert">
          ⚠️ Notifications are not supported in your browser
        </div>
        
        <div v-else>
          <div class="status">
            <strong>Permission Status:</strong> {{ notificationPermission }}
          </div>
          
          <button 
            v-if="notificationPermission === 'default'" 
            @click="handleRequestPermission"
            class="btn btn-primary"
          >
            Enable Notifications
          </button>
          
          <div v-if="notificationPermission === 'granted'" class="controls">
            <button 
              v-if="!isRunning" 
              @click="handleStartNotifications"
              class="btn btn-success"
            >
              Start Periodic Notifications (Every 1 Minute)
            </button>
            
            <button 
              v-else 
              @click="handleStopNotifications"
              class="btn btn-danger"
            >
              Stop Notifications
            </button>
            
            <button 
              @click="handleSendTestNotification"
              class="btn btn-secondary"
            >
              Send Test Notification
            </button>
          </div>
          
          <div v-if="notificationPermission === 'denied'" class="alert alert-error">
            ❌ Notification permission denied. Please enable it in your browser settings.
          </div>
        </div>
      </div>
      
      <div v-if="lastNotificationTime" class="info">
        <strong>Last notification sent:</strong> {{ lastNotificationTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications'

const {
  checkSupport,
  isSupported: notificationSupported,
  permission: notificationPermission,
  registerServiceWorker,
  requestPermission,
  sendTestNotification,
  startPeriodicNotifications,
  stopPeriodicNotifications,
  subscribeToPush,
} = useNotifications()

const isRunning = ref(false)
const lastNotificationTime = ref('')

const handleRequestPermission = async () => {
  try {
    await requestPermission()
    await registerServiceWorker()
    await subscribeToPush()
  } catch (error) {
    console.error('Failed to request permission:', error)
  }
}

const handleStartNotifications = async () => {
  try {
    await startPeriodicNotifications(1)
    isRunning.value = true
    lastNotificationTime.value = new Date().toLocaleString()
  } catch (error) {
    console.error('Failed to start notifications:', error)
  }
}

const handleStopNotifications = async () => {
  try {
    await stopPeriodicNotifications()
    isRunning.value = false
  } catch (error) {
    console.error('Failed to stop notifications:', error)
  }
}

const handleSendTestNotification = async () => {
  try {
    await sendTestNotification()
    lastNotificationTime.value = new Date().toLocaleString()
  } catch (error) {
    console.error('Failed to send test notification:', error)
  }
}

onMounted(() => {
  checkSupport()
})

useHead({
  link: [
    {
      href: "/manifest.webmanifest",
      rel: "manifest",
    },
  ],
})
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 800px;
  padding: 2rem;
}

.content {
  text-align: center;
}

h1 {
  color: #00dc82;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.notification-controls {
  background: #f5f5f5;
  border-radius: 8px;
  margin: 2rem 0;
  padding: 2rem;
}

.status {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: #00dc82;
  color: white;
}

.btn-primary:hover {
  background: #00b870;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #da190b;
}

.btn-secondary {
  background: #2196f3;
  color: white;
}

.btn-secondary:hover {
  background: #0b7dda;
}

.alert {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
  margin: 1rem 0;
  padding: 1rem;
}

.alert-error {
  background: #f8d7da;
  border-left-color: #dc3545;
  color: #721c24;
}

.info {
  background: #e7f3ff;
  border-radius: 6px;
  color: #004085;
  margin-top: 2rem;
  padding: 1rem;
}
</style>
