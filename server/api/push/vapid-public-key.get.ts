import { VAPID_KEYS } from '../../utils/vapid'

export default defineEventHandler(() => {
  return {
    publicKey: VAPID_KEYS.publicKey
  }
})
