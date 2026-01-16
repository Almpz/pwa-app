import { addSubscription } from '../../utils/subscriptions'

export default defineEventHandler(async (event) => {
  const subscription = await readBody(event)
  
  addSubscription(subscription)
  
  return {
    success: true
  }
})
