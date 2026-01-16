interface PushSubscription {
  endpoint: string
  expirationTime: number | null
  keys: {
    auth: string
    p256dh: string
  }
}

const subscriptions: PushSubscription[] = []

export const addSubscription = (subscription: PushSubscription) => {
  const exists = subscriptions.find(s => s.endpoint === subscription.endpoint)
  if (!exists) {
    subscriptions.push(subscription)
  }
}

export const getAllSubscriptions = () => {
  return subscriptions
}

export const removeSubscription = (endpoint: string) => {
  const index = subscriptions.findIndex(s => s.endpoint === endpoint)
  if (index > -1) {
    subscriptions.splice(index, 1)
  }
}
