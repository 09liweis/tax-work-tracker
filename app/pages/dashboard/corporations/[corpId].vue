<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Corporation Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a corporate client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const corpId = route.params.corpId

// state for corporation record fetched from API
const corporation = ref(null)
const loading = ref(true)
const fetchError = ref('')

const fetchCorporation = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/corporations/${corpId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load corporation')
    corporation.value = { ...res.corporation, id: res.corporation._id || res.corporation.id }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading corporation'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCorporation()
  if (!corporation.value) {
    throw createError({ statusCode: 404, statusMessage: 'Corporation not found' })
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Main Content -->
    <div class="px-4 py-8">
      <div v-if="loading" class="text-center text-gray-500">Loading corporation details…</div>
      <div v-else-if="fetchError" class="text-center text-red-500">{{ fetchError }}</div>
      <div v-else-if="corporation">
        <!-- Corporation Card -->
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-8">
          <div class="flex items-center px-6 py-6">
            <div class="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ corporation.name.charAt(0) }}</span>
            </div>
            <div class="ml-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ corporation.name }}</h2>
              <div class="mt-1 text-sm text-gray-500">{{ corporation.industry }}</div>
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="flex flex-wrap gap-4">
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Tax ID:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.taxId }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Status:</span>
                <span :class="corporation.status === 'Active' ? 'bg-green-100 text-green-800' : corporation.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2">
                  {{ corporation.status }}
                </span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Annual Revenue:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.revenue }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Phone:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.phone }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Address:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Corporate Tax Returns Section (optional, can be removed for minimalism) -->
        <!-- ...existing code... -->

        <!-- Owners/Directors Section (optional, can be removed for minimalism) -->
        <!-- ...existing code... -->
      </div> <!-- end corporation conditional container -->
    </div> <!-- end main content wrapper -->
  </div> <!-- end page container -->
</template>