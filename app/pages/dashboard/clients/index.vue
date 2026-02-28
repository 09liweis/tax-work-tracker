<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Clients - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View and manage your tax clients in the work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

import { apiGet } from '~/utils/api'

const clients = ref([])
const isLoading = ref(true)
const fetchError = ref('')
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

const route = useRoute()

const fetchClients = async (page = 1) => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const url = `/api/clients?page=${page}&limit=${pagination.value.limit}`
    const res = await apiGet(url)
    if (!res.success) throw new Error(res.error || 'Failed to load clients')
    clients.value = res.clients.map(c => ({ ...c, id: c._id || c.id }))
    pagination.value = res.pagination

    // Update URL without page reload
    if (process.client) {
      const query = { ...route.query, page: page.toString() }
      await navigateTo({ path: route.path, query }, { replace: true })
    }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading clients'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Get page from URL query param
  const pageFromQuery = parseInt(route.query.page) || 1
  fetchClients(pageFromQuery)
})

// Watch for route query changes
watch(() => route.query.page, (newPage) => {
  if (newPage && !fetchError.value) {
    fetchClients(parseInt(newPage))
  }
})

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentClient = ref(null)

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  currentClient.value = null
  isModalOpen.value = true
}

const openEditModal = (client) => {
  isEditing.value = true
  currentClient.value = { ...client }
  isModalOpen.value = true
}

const handleSaved = (saved) => {
  // Refresh the current page after save
  fetchClients(pagination.value.page)
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}

// Pagination helper functions
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchClients(page)
  }
}

const goToPrev = () => {
  if (pagination.value.hasPrev) {
    goToPage(pagination.value.page - 1)
  }
}

const goToNext = () => {
  if (pagination.value.hasNext) {
    goToPage(pagination.value.page + 1)
  }
}

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const { page, totalPages } = pagination.value
  const pages = []
  const showPages = 5 // Number of page buttons to show

  let startPage = Math.max(1, page - Math.floor(showPages / 2))
  let endPage = Math.min(totalPages, startPage + showPages - 1)

  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<template>
  <div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <ClientsClientHeader :client-count="pagination.total" @add-client="openAddModal" />

    <ClientsClientList
      :clients="clients"
      :loading="isLoading"
      :error="fetchError"
      @edit="openEditModal"
      @retry="fetchClients"
    />

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <Button @click="goToPrev" :disabled="!pagination.hasPrev" variant="outline">Previous</Button>
          <Button @click="goToNext" :disabled="!pagination.hasNext" variant="outline" class="ml-3">Next</Button>
        </div>

        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                @click="goToPrev"
                :disabled="!pagination.hasPrev"
                variant="outline"
                class="rounded-l-md rounded-r-none px-2 border-r-0"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </Button>

              <button
                v-for="pageNum in pageNumbers"
                :key="pageNum"
                @click="goToPage(pageNum)"
                :class="[
                  pageNum === pagination.page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                ]"
              >
                {{ pageNum }}
              </button>

              <Button
                @click="goToNext"
                :disabled="!pagination.hasNext"
                variant="outline"
                class="rounded-r-md rounded-l-none px-2 border-l-0"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <ClientModal
      :visible="isModalOpen"
      :client="currentClient"
      :is-editing="isEditing"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>
