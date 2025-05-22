<script setup lang="ts">
import { ref, computed } from 'vue'
import PlatesTable from '@/components/PlatesTable.vue'
import AudioTestPlayground from '@/components/AudioTestPlayground.vue'
import ProcessBlock from '@/components/ProcessBlock.vue'


const audioStep = ref('Idle')
const plateStep = ref('Idle')
const recoStep = ref('Idle')

const audioRunning = ref(false)
const plateRunning = ref(false)
const recoRunning = ref(false)



// Dummy data for plates
const plates = [
  {
    id: 1,
    number: 'Plate 001',
    orders: 25,
    users: 10,
    ordersLink: '/orders/plate-001',
    imageLink: '/images/plate-001.jpg',
  },
]

// State to track readiness
const isReadyToTest = ref(false)
const processState = ref('idle') // 'idle', 'ready', 'running', 'done'

// Handle the readyToTest event
const handleReadyToTest = (isReady) => {
  isReadyToTest.value = isReady
  processState.value = isReady ? 'ready' : 'idle'
}

const startProcess = async () => {
  if (!isReadyToTest.value) return

  processState.value = 'running'

  // Begin polling
  const interval = setInterval(async () => {
    const query = `
      query {
        processStatuses(userId: "demo-user") {
          process
          step
          done
        }
      }
    `

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const json = await response.json()
      const statuses = json.data.processStatuses

      statuses.forEach((status: any) => {
        if (status.process === 'audio') {
          audioStep.value = status.step
          audioRunning.value = !status.done
        } else if (status.process === 'plate') {
          plateStep.value = status.step
          plateRunning.value = !status.done
        } else if (status.process === 'reco') {
          recoStep.value = status.step
          recoRunning.value = !status.done
        }
      })

      // Stop polling when all done
      const allDone = statuses.every((s: any) => s.done)
      if (allDone) {
        clearInterval(interval)
        processState.value = 'done'
        setTimeout(() => {
          processState.value = 'idle'
        }, 2000)
      }
    } catch (err) {
      console.error('[pollProcessStatuses] error:', err)
    }
  }, 1000)
}




// Computed class for the flashing border
const borderClass = computed(() => {
  switch (processState.value) {
    case 'ready':
      return 'border-gray-500 animate-pulse'
    case 'running':
      return 'border-green-500 animate-pulse'
    case 'done':
      return 'border-red-500 animate-pulse'
    default:
      return ''
  }
})
</script>

<template>
  <!-- Readiness Indicator -->
  <div :class="['flex justify-center p-4 border-4 rounded', borderClass]">
  <div class="p-4 space-y-6">
    <!-- Plates Table -->
    <PlatesTable :plates="plates" />

    <!-- Audio Test Playground -->
    <AudioTestPlayground
      @readyToTest="handleReadyToTest"
    />

      <!-- Wrap in vertical layout -->
<div class="space-y-4 w-full max-w-xl mx-auto">
  <ProcessBlock
    title="Audio Process"
    :currentStep="audioStep"
    :isRunning="audioRunning"
  />
  <ProcessBlock
    title="Plate Recognition Process"
    :currentStep="plateStep"
    :isRunning="plateRunning"
  />
  <ProcessBlock
    title="Recommendation Process"
    :currentStep="recoStep"
    :isRunning="recoRunning"
  />

  <!-- Start Process Button -->
  <button
    @click="startProcess"
    :class="isReadyToTest 
      ? 'bg-blue-500 text-white hover:bg-blue-600' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    class="px-4 py-2 rounded w-full"
    :disabled="!isReadyToTest"
  >
    Trigger Plate Recognition
  </button>
</div>

    </div>
  </div>



</template>

<style>
/* Add animation for pulsing effect */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1s infinite;
}
</style>