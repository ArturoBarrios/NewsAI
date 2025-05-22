<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const config = useRuntimeConfig()
const router = useRouter()

const { server } = config.public

const handleLogin = async () => {
  error.value = ''

  try {
    const response = await $fetch('/graphql', {
      baseURL: server,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: {
        query: `
          mutation Signin($email: String!, $password: String!) {
            signin(email: $email, password: $password) {
              id
            }
          }
        `,
        variables: {
          email: email.value,
          password: password.value
        }
      }
    })

    if (response?.data?.signin?.id) {
      router.push('/profile')
    } else {
      error.value = 'Invalid email or password.'
    }
  } catch (err) {
    console.error('Login error', err)
    error.value = 'Failed to log in. Please try again.'
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-xl">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">Log In</h1>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition cursor-pointer"
        >
          Log In
        </button>
      </form>
    </div>
  </section>
</template>
