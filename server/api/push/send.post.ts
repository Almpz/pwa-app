import webpush from 'web-push'
import { getAllSubscriptions } from '../../utils/subscriptions'
import { VAPID_KEYS } from '../../utils/vapid'

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, message } = body
  
  const subscriptions = getAllSubscriptions()
  
  const payload = JSON.stringify({
    title: title || 'Notification',
    body: message || 'You have a new notification',
    timestamp: Date.now()
  })
  
  const results = await Promise.allSettled(
    subscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload)
    )
  )
  
  return {
    sent: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    total: subscriptions.length
  }
})
