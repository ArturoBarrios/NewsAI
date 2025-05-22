import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()

  if (!auth.isReady) {
    auth.fetchUser()
  }
})
