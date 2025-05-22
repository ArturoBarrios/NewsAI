<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">📰 Bluesky Story Groups</h1>

    <div v-if="loading" class="text-gray-500">Loading stories...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>

    <div v-else>
      <div
        v-for="parent in parentArticles"
        :key="parent.id"
        class="mb-8 border border-gray-300 rounded-lg shadow bg-white p-4"
      > 
        <h2 class="text-xl font-semibold text-blue-800">{{ parent.title }}</h2>
        <p v-if="parent.summary" class="text-gray-600 text-sm mt-1">
          {{ parent.summary }}
        </p>
        <div class="mt-4 space-y-4">
          <div
            v-for="article in parent.articles"
            :key="article.id"
            class="p-3 border border-gray-100 rounded hover:bg-gray-50 transition"
          >
            <a :href="article.url" target="_blank" class="text-blue-600 font-medium hover:underline">
              {{ article.title }}
            </a>
            <p class="text-xs text-gray-500">{{ formatDate(article.date) }}</p>
            <p class="text-gray-800 mt-1 text-sm whitespace-pre-wrap">{{ article.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const server = config.public.server
const parentArticles = ref([])
const loading = ref(true)
const error = ref(null)

const fetchParentArticles = async () => {
  try {
    const res = await $fetch('/graphql', {
      baseURL: server,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        query: `
          query {
            parentArticles {
              id
              title
              summary
              slug
              createdAt
              articles {
                id
                title
                url
                content
                date
              }
            }
          }
        `,
      },
    })

    parentArticles.value = res?.data?.parentArticles || []
  } catch (err) {    
    error.value = err?.message || 'Failed to fetch parent articles'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchParentArticles()
})

function formatDate(iso) {
  return new Date(iso).toLocaleString()
}
</script>
