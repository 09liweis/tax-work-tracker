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
const corporationsLoading = ref(false)
const corporationsError = ref('')

const fetchCorporations = async () => {
  corporationsLoading.value = true
  corporationsError.value = ''
  try {
    const res = await apiGet('/api/corporations')
    if (!res.success) throw new Error(res.error || 'Failed to load corporations')
    corporations.value = (res.corporations || []).map(c => ({ ...c, id: c._id || c.id }))
  } catch (err) {
    corporationsError.value = err?.message || 'An error occurred while loading corporations'
  } finally {
    corporationsLoading.value = false
  }
}

onMounted(fetchCorporations)

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

  await fetchCorporations()
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
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Corporation
          </button>
        </div>
      </div>
        <CorporationList :corporations="corporations" />
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