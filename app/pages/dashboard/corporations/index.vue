<script setup>
import CorporationList from '~/components/CorporationList.vue'
import CorporationModal from '~/components/CorporationModal.vue'
import { apiGet, apiPost } from '~/utils/api'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Corporations - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Handle corporate accounts and business clients in the tax work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// corporation list from server
const corporations = ref([])
const corporationsLoading = ref(true)
const corporationsError = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

const route = useRoute()

const fetchCorporations = async (page = currentPage.value) => {
  corporationsLoading.value = true
  corporationsError.value = ''
  try {
    const res = await apiGet(`/api/corporations?page=${page}&limit=${pageSize.value}`)
    if (!res.success) throw new Error(res.error || 'Failed to load corporations')
    corporations.value = (res.corporations || []).map(c => ({ ...c, id: c._id || c.id }))
    
    // Update pagination
    currentPage.value = res.pagination?.page || 1
    totalPages.value = res.pagination?.totalPages || 1
    totalItems.value = res.pagination?.total || 0
  } catch (err) {
    corporationsError.value = err?.message || 'An error occurred while loading corporations'
  } finally {
    corporationsLoading.value = false
  }
}

onMounted(() => {
  // Get page from URL query parameter
  const pageFromUrl = parseInt(route.query.page)
  if (pageFromUrl && pageFromUrl > 0) {
    currentPage.value = pageFromUrl
  }
  fetchCorporations(currentPage.value)
})

// Pagination handlers
const router = useRouter()

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    router.push({ query: { page } })
    fetchCorporations(page)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    const nextPageNum = currentPage.value + 1
    currentPage.value = nextPageNum
    router.push({ query: { page: nextPageNum } })
    fetchCorporations(nextPageNum)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    const prevPageNum = currentPage.value - 1
    currentPage.value = prevPageNum
    router.push({ query: { page: prevPageNum } })
    fetchCorporations(prevPageNum)
  }
}

// Get page numbers for pagination (shows up to 5 pages)
const getPageNumber = (index) => {
  const startPage = Math.max(1, currentPage.value - 2)
  return startPage + index - 1
}

// Modal state (now managed by component)
const isModalOpen = ref(false)
const modalCorporation = ref(null)
const isEditing = ref(false)

const openAddModal = () => {
  isEditing.value = false
  modalCorporation.value = null
  isModalOpen.value = true
}

const openEditModal = (corp) => {
  isEditing.value = true
  modalCorporation.value = { ...corp }
  isModalOpen.value = true
}

const handleSave = async (corp) => {
  try {
    const res = await apiPost('/api/corporations/upsert', corp)
    if (!res.success) throw new Error(res.error || 'Failed to save corporation')
  } catch (err) {
    console.error('Error saving corporation', err)
  }

  await fetchCorporations(currentPage.value)
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Accounts</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your corporate clients and their tax information.</p>
          </div>
          <Button @click="openAddModal">
            Add Corporation
          </Button>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="corporationsLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-3 text-sm text-gray-500">Loading corporations...</p>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="corporationsError" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center">
          <svg class="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="mt-3 text-sm text-red-600">{{ corporationsError }}</p>
          <Button @click="fetchCorporations(currentPage)" variant="secondary" size="sm" class="mt-3">
            Retry
          </Button>
        </div>
      </div>
      
      <CorporationList v-else :corporations="corporations" />
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage.value - 1) * pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage.value * pageSize, totalItems) }}</span> of 
            <span class="font-medium">{{ totalItems }}</span> results
          </div>
          <div class="flex gap-2">
            <Button
              @click="prevPage"
              :disabled="currentPage === 1"
              variant="secondary"
              size="sm"
            >
              Previous
            </Button>
            <div class="flex gap-1">
              <Button
                v-for="page in Math.min(totalPages, 5)"
                :key="page"
                @click="goToPage(getPageNumber(page))"
                :variant="getPageNumber(page) === currentPage ? 'primary' : 'ghost'"
                size="sm"
                :disabled="getPageNumber(page) === currentPage"
              >
                {{ getPageNumber(page) }}
              </Button>
            </div>
            <Button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              variant="secondary"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CorporationModal
    :visible="isModalOpen"
    :editing="isEditing"
    :corporation="modalCorporation"
    @close="closeModal"
    @save="handleSave"
  />
</template>