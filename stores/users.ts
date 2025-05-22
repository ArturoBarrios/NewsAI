// stores/users.ts
import { defineStore } from 'pinia'

export type User = {
  id: string
  name: string
  email?: string
  profiles: {
    id: string
    message: string
  }[]
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),

  getters: {
    getUserById: (state) => (id: string) => {
      return state.users.find(user => user.id === id) || null
    },
  },

  actions: {
    setUsers(users: User[]) {
      this.users = users
    },
    clearUsers() {
      this.users = []
    },
  },
})
