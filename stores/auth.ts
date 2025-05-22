import { defineStore } from 'pinia'

type User = {
  id: string
  email: string
  name?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isReady: false,
  }),

  actions: {
    async fetchUser() {
      if (process.server) return // 🛡️ Block SSR calls

      try {
        const { data } = await useFetch<User | null>('/api/me', {
          credentials: 'include',
          server: false, // 🛡️ Only client
        })

        this.user = data.value ?? null
      } catch {
        this.user = null
      } finally {
        this.isReady = true // 🚀 Mark page ready immediately after first attempt
      }
    },

    logout() {
      document.cookie = 'token=; Max-Age=0; path=/'
      this.user = null
      this.isReady = true
    },
  },
})
