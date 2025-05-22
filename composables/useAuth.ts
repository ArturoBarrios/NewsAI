// composables/useAuth.ts
import { useState, useFetch } from '#app'

type User = {
  id: string
  email: string
  name?: string
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)

  const fetchUser = async () => {
    if (!import.meta.client) return

    try {
      const { data, error } = await useFetch<User | null>('/api/me', {
        credentials: 'include',
      })

      if (!error.value && data.value) {
        user.value = data.value
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    }
  }

  return {
    user,
    fetchUser,
  }
}
