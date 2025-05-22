<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Testing Playground</h2>

    <!-- Plate Selection -->
    <div class="space-y-2">
      <label class="block font-medium">Select Plate:</label>
      <select v-model="selectedPlate" class="border border-gray-300 rounded px-4 py-2">
        <option v-for="plate in plates" :key="plate.id" :value="plate.id">
          {{ plate.number }} ({{ plate.users }} users, {{ plate.datapoints }} datapoints)
        </option>
      </select>
    </div>

    <!-- User Selection -->
    <div class="space-y-2">
      <label class="block font-medium">Select User:</label>
      <select v-model="selectedUser" class="border border-gray-300 rounded px-4 py-2" :disabled="!selectedPlate">
        <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
          {{ user.name }} ({{ user.datapoints }} datapoints)
        </option>
      </select>
    </div>

    <!-- Model Selection -->
    <div class="space-y-2">
      <label class="block font-medium">Select Model:</label>
      <select v-model="selectedModel" class="border border-gray-300 rounded px-4 py-2">
        <option value="model1">Model 1</option>
        <option value="model2">Model 2</option>
        <option value="model3">Model 3</option>
      </select>
    </div>

    <!-- Model Information -->
    <div v-if="modelInfo" class="p-4 border border-gray-300 rounded bg-gray-50">
      <h3 class="text-lg font-bold">Model Information</h3>
      <p>{{ modelInfo }}</p>
    </div>

    <div class="space-y-2">
      <label class="block font-medium">Input Audio:</label>
      <div class="flex items-center space-x-2">
        <input type="file" @change="handleFileUpload" class="border border-gray-300 rounded px-4 py-2" :disabled="isRecording" />
        <button v-if="uploadedFile" @click="clearFile" class="bg-red-500 text-white px-2 py-1 rounded">X</button>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="startRecording"
          :class="['px-4 py-2 rounded', uploadedFile || isRecording ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white']"
          :disabled="uploadedFile || isRecording"
        >
          Record Audio
        </button>
        <button
          @click="stopRecording"
          :class="['px-4 py-2 rounded', !isRecording ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white']"
          :disabled="!isRecording"
        >
          Stop Recording
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-if="output" class="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
      <p class="font-medium">Output:</p>
      <p>{{ output }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Emit function
const emit = defineEmits(['readyToTest'])

// Plate, user, and model selection
const selectedPlate = ref(null)
const selectedUser = ref(null)
const selectedModel = ref('model1')

// Loading and output states
const isLoading = ref(false)
const output = ref('')
const uploadedFile = ref<File | null>(null)
const isRecording = ref(false)

// Computed property for readiness
const isReadyToTest = computed(() => {
  return uploadedFile.value &&uploadedFile!=null
})

// Watch for changes in isReadyToTest and emit the value
watch(isReadyToTest, (newValue) => {
  console.log('isReadyToTest:', newValue)
  emit('readyToTest', newValue)
})

// Dummy data for plates
const plates = ref([
  { id: 1, number: 'Plate 001', users: 10, datapoints: 100 },
  { id: 2, number: 'Plate 002', users: 7, datapoints: 50 },
  { id: 3, number: 'Plate 003', users: 12, datapoints: 200 },
])

// Dummy data for users
const users = ref([
  { id: 1, name: 'User 1', datapoints: 10 },
  { id: 2, name: 'User 2', datapoints: 15 },
  { id: 3, name: 'User 3', datapoints: 5 },
])

// Filtered users based on selected plate
const filteredUsers = computed(() => {
  if (!selectedPlate.value) return []
  return users.value // You can add filtering logic here if needed
})

// Model descriptions
const modelDescriptions = {
  model1: 'Model 1: A lightweight model optimized for speed. Created on January 1, 2025. Parameters: 1M.',
  model2: 'Model 2: A balanced model with moderate accuracy and speed. Created on February 15, 2025. Parameters: 5M.',
  model3: 'Model 3: A high-accuracy model designed for complex tasks. Created on March 10, 2025. Parameters: 10M.',
}

const modelInfo = computed(() => modelDescriptions[selectedModel.value])

// Handlers
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) uploadedFile.value = file
}

const clearFile = () => {
  uploadedFile.value = null
}

const startRecording = () => {
  isRecording.value = true
}

const stopRecording = () => {
  isRecording.value = false
}

const submitAudio = () => {
  if (!selectedPlate.value) {
    alert('Please select a plate before submitting.')
    return
  }
  if (!selectedUser.value) {
    alert('Please select a user before submitting.')
    return
  }

  isLoading.value = true
  setTimeout(() => {
    output.value = `Would you like to order a McChicken with large fries, a large coke, and 2 packets of hot sauce again? (Processed for Plate ${selectedPlate.value}, User ${selectedUser.value})`
    isLoading.value = false
  }, 2000)
}
</script>