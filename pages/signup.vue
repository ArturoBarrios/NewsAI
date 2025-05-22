<script setup>
import { ref } from 'vue'
import { useRouter, useRuntimeConfig } from '#imports'

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const success = ref(false)
const config = useRuntimeConfig()
const router = useRouter()
const { server } = config.public

const handleSignup = async () => {
  try {
    await $fetch('/graphql', {
      baseURL: server,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        query: `
          mutation CreateUser(
            $name: String            
            $email: String!
            $phone: String
            $password: String!
          ) {
            createUser(
              name: $name              
              email: $email
              phone: $phone
              password: $password
            ) {
              id
            }
          }
        `,
        variables: {
          name: name.value,          
          email: email.value,
          phone: phone.value,
          password: password.value,
        },
      },
    })

    success.value = true

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    console.error("Signup failed", err)
  }
}
</script>

  





<template>
    <section class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md bg-white p-8 rounded-xl relative overflow-hidden">
        <transition name="fade">
          <div
            v-if="success"
            class="absolute top-0 left-0 w-full px-4 py-3 bg-green-100 text-green-800 text-center font-semibold z-10"
          >
            Signup successful! Redirecting...
          </div>
        </transition>
  
        <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">Create an Account</h1>
        <form class="space-y-4" @submit.prevent="handleSignup">
          <input v-model="name" type="text" placeholder="Name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />          
          <input v-model="email" type="email" placeholder="Email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="phone" type="tel" placeholder="Phone"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="password" type="password" placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  </template>
  

  <style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
