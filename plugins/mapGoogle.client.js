import { Loader } from '@googlemaps/js-api-loader'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: 'weekly',
    libraries: ['places', 'drawing', 'geometry']
  })

  const GM = {
    loaded: false,
    instance: null,
    placeService: null,

    async load() {
      if (!this.loaded) {
        const google = await loader.load()
        this.loaded = true
        this.instance = google
      }
    },

    setPlaceService(map) {
      this.placeService = new window.google.maps.places.PlacesService(map)
    },

    getPlaceDetails(placeRequest) {
      return new Promise((resolve, reject) => {
        this.placeService.getDetails(placeRequest, (response, status) => {
          if (status === 'OK') {
            resolve(response)
          } else {
            reject(status)
          }
        })
      })
    }
  }

  // Make available as $gm in your app
  nuxtApp.provide('gm', GM)
})
