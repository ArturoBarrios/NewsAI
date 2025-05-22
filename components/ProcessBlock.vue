<script setup lang="ts">
defineProps<{
  title: string
  currentStep: string
  isRunning: boolean
}>()
</script>

<template>
  <div class="border rounded p-4 bg-white shadow w-full">
    <div class="flex items-center space-x-2 mb-2">
      <svg
        v-if="isRunning"
        class="w-4 h-4 text-blue-500 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <h2 class="text-lg font-semibold">{{ title }}</h2>
    </div>
    <div>
      <p v-if="isRunning">{{ currentStep }}</p>
      <p v-else class="text-gray-500">Idle</p>
    </div>
  </div>
</template>
