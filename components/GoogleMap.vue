<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const { $gm } = useNuxtApp()
const mapRef = ref(null)
const searchInput = ref(null)
const emit = defineEmits(['place-selected'])

let map, marker, lastSelectedPlace = null

onMounted(async () => {
  await $gm.load()

  map = new window.google.maps.Map(mapRef.value, {
    center: { lat: 40.749933, lng: -73.98633 },
    zoom: 13
  })

  marker = new window.google.maps.Marker({
    map,
    visible: false
  })

  const autocomplete = new window.google.maps.places.Autocomplete(searchInput.value, {
    fields: ['formatted_address', 'geometry', 'name']
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()

    if (!place.geometry || !place.geometry.location) {
      alert('No location data found for that place.')
      return
    }

    map.panTo(place.geometry.location)
    map.setZoom(15)

    marker.setPosition(place.geometry.location)
    marker.setVisible(true)

    lastSelectedPlace = {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }

    emit('place-selected', lastSelectedPlace)
  })
})

// Expose the last selected place (optional, in case you want access directly)
defineExpose({
  getLastSelectedPlace: () => lastSelectedPlace
})
</script>

<template>    
  <div class="max-w-5xl mx-auto p-6 space-y-4">
    <input
      ref="searchInput"
      type="text"
      placeholder="Search for an address"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div ref="mapRef" id="map" class="w-full h-[500px] rounded shadow border"></div>
  </div>
</template>
