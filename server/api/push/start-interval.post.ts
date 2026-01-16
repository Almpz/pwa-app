import webpush from 'web-push'
import { getAllSubscriptions } from '../../utils/subscriptions'
import { VAPID_KEYS } from '../../utils/vapid'

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
)

let intervalId: NodeJS.Timeout | null = null

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { intervalMinutes = 1 } = body
  
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  const sendPushToAll = async () => {
    const subscriptions = getAllSubscriptions()
    const now = new Date()
    const timeString = now.toLocaleTimeString()
    
    const payload = JSON.stringify({
      title: 'Periodic Notification',
      body: `This notification was sent at ${timeString}`,
      timestamp: Date.now()
    })
    
    await Promise.allSettled(
      subscriptions.map(subscription =>
        webpush.sendNotification(subscription, payload).catch(err => {
          console.error('Push failed:', err)
        })
      )
    )
  }
  
  intervalId = setInterval(sendPushToAll, intervalMinutes * 60 * 1000)
  
  return {
    success: true,
    message: `Push notifications will be sent every ${intervalMinutes} minute(s)`
  }
})
