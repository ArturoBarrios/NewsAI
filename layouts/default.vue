<template>
  <div v-if="auth.isReady" class="min-h-screen block">
    <div class="">
      <header class="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 class="text-xl font-bold text-gray-800">AI News</h1>
        <nav class="flex gap-6 items-center text-sm">
          <NuxtLink to="/feed" class="text-blue-600 hover:underline">Feed</NuxtLink>
          <NuxtLink to="/top" class="text-blue-600 hover:underline">Top 10</NuxtLink>
  
          <template v-if="auth.user">
            <span class="text-gray-700">Hi, {{ auth.user.name || auth.user.email }}</span>
            <button
              @click="handleLogout"
              class="text-red-600 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/signup" class="text-blue-600 hover:underline">Sign Up</NuxtLink>
            <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
          </template>
        </nav>
      </header>

    </div>

    <NuxtPage />
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Loading...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'

const auth = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()
const { server } = config.public

onMounted(async () => {
  await auth.fetchUser()
})

const handleLogout = async () => {
  try {
    const response = await $fetch('/graphql', {
      baseURL: server,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: {
        query: `
          mutation {
            logout
          }
        `,
      },
    })

    if (response?.data?.logout) {
      auth.logout()
      router.push('/login')
    } else {
      console.error('Logout failed: server returned false')
    }
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>
