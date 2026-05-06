<script setup>
import { SITE_TITLE } from '~/utils/constants'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: `Client Details - ${SITE_TITLE}`,
  meta: [
    { name: 'description', content: 'View detailed information about a tax client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

import ClientHeader from '~/components/client/ClientHeader.vue'
import ClientDetails from '~/components/client/ClientDetails.vue'
import ClientTabs from '~/components/client/ClientTabs.vue'
import ClientTabContent from '~/components/client/ClientTabContent.vue'
import ClientModal from '~/components/client/ClientModal.vue'
import RelativesSection from '~/components/client/RelativesSection.vue'
import TaskModal from '~/components/TaskModal.vue'
import CorporationModal from '~/components/corporation/CorporationModal.vue'
import { apiGet, apiPost } from '~/utils/api'

const route = useRoute()
const clientId = route.params.clientId

const client = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// personal tax management
const personalTaxes = ref([])
const personalTaxesLoading = ref(false)
const personalTaxesError = ref('')
const filterYear = ref('')

// corporation state
const corporations = ref([])
const corporationsLoading = ref(false)
const corporationsError = ref('')

// relatives state
const relatives = ref([])
const relativesLoading = ref(false)
const relativesError = ref('')

// tab state
const activeTab = ref('personal-tax')

// modal state
const showTaskModal = ref(false)
const modalTask = ref(null)

// corporation modal state
const showCorpModal = ref(false)
const modalCorp = ref(null)
const corpEditing = ref(false)

// client modal state
const showClientModal = ref(false)
const modalClient = ref(null)
const clientEditing = ref(false)

// relative modal state
const showRelativeModal = ref(false)
const modalRelative = ref(null)
const relativeEditing = ref(false)


const fetchClient = async () => {
  relativesLoading.value = true
  relativesError.value = ''

  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await apiGet(`/api/clients/${clientId}`)
    if (!res.success) throw new Error(res.error || 'Failed to load client')
    client.value = { ...res.client, id: res.client._id || res.client.id }

    relatives.value = (res.relatives || [])
    corporations.value = (res.corporations || [])
    personalTaxes.value = (res.personalTaxes || [])
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading client'
  } finally {
    isLoading.value = false
    relativesLoading.value = false
  }
}

onMounted(async () => {
  await fetchClient()
})

const fetchPersonalTaxes = async (year = '') => {
  personalTaxesLoading.value = true
  personalTaxesError.value = ''
  try {
    const query = year ? `?clientId=${clientId}&year=${year}` : `?clientId=${clientId}`
    const res = await apiGet(`/api/personalTax${query}`)
    if (!res.success) throw new Error(res.error || 'Failed to load personal tax records')
    personalTaxes.value = res.personalTaxes || []
  } catch (err) {
    personalTaxesError.value = err?.message || 'An error occurred while loading personal taxes'
  } finally {
    personalTaxesLoading.value = false
  }
}

const openModal = () => {
  modalTask.value = null
  showTaskModal.value = true
}

const openEditModal = (task) => {
  modalTask.value = task
  showTaskModal.value = true
}

const closeModal = () => {
  showTaskModal.value = false
  modalTask.value = null
}

const handleSave = async () => {
  await fetchPersonalTaxes()
  closeModal()
}

const closeCorpModal = () => {
  showCorpModal.value = false
  modalCorp.value = null
}

const handleCorpSave = async (corpData) => {
  try {
    const res = await apiPost('/api/corporations/upsert', corpData)
    if (!res.success) throw new Error(res.error || 'Failed to save corporation')
  } catch (err) {
    console.error('Error saving corporation', err)
  }

  await fetchClient()
  closeCorpModal()
}

// client modal handlers
const openEditClientModal = () => {
  clientEditing.value = true
  modalClient.value = { ...client.value }
  showClientModal.value = true
}

const closeClientModal = () => {
  showClientModal.value = false
  modalClient.value = null
}

const handleClientSave = async (savedClient) => {
  client.value = { ...savedClient, id: savedClient._id || savedClient.id }
  closeClientModal()
}

// Handle year filter
const handleFilter = async ({ year }) => {
  filterYear.value = year
  await fetchPersonalTaxes(year)
}

// Corporation handlers
const handleAddCorporation = () => {
  corpEditing.value = false
  modalCorp.value = null
  showCorpModal.value = true
}

const handleEditCorporation = (corp) => {
  corpEditing.value = true
  modalCorp.value = { ...corp }
  showCorpModal.value = true
}

// Relative handlers
const handleAddRelative = () => {
  relativeEditing.value = false
  modalRelative.value = null
  showRelativeModal.value = true
}

const handleEditRelative = (relative) => {
  relativeEditing.value = true
  modalRelative.value = { ...relative }
  showRelativeModal.value = true
}

const closeRelativeModal = () => {
  showRelativeModal.value = false
  modalRelative.value = null
}

const handleRelativeSave = async () => {
  await fetchClient()
  closeRelativeModal()
}

const handleDeleteRelative = async (relative) => {
  try {
    const res = await apiPost('/api/clients/delete', { id: relative.id || relative._id })
    if (!res.success) throw new Error(res.error || 'Failed to delete relative')
    await fetchClient()
  } catch (err) {
    alert(err?.message || 'Error deleting relative')
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-gray-600 font-medium">Loading client details</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="max-w-7xl mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 rounded p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-800 font-medium">{{ fetchError }}</p>
          </div>
          <Button @click="fetchClient" variant="link">Retry</Button>
        </div>
      </div>
    </div>

    <!-- Client Details -->
    <div v-else-if="client" class="max-w-10xl mx-auto px-4 py-6 space-y-6">
      <!-- Client Header -->
      <ClientHeader :client="client" @edit="openEditClientModal" />

      <!-- Tabs -->
      <ClientTabs
        v-model="activeTab"
        :personal-tax-count="personalTaxes.length"
        :corporation-count="corporations.length"
      />

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <ClientDetails :client="client" />
          <RelativesSection
            :relatives="relatives"
            :loading="relativesLoading"
            :error="relativesError"
            @new="handleAddRelative"
            @edit="handleEditRelative"
            @delete="handleDeleteRelative"
          />
        </div>

        <!-- Main Content Area with Tabs -->
        <div class="lg:col-span-2">
          <ClientTabContent
            :active-tab="activeTab"
            :client-id="clientId"
            :personal-taxes="personalTaxes"
            :personal-taxes-loading="personalTaxesLoading"
            :personal-taxes-error="personalTaxesError"
            :filter-year="filterYear"
            :corporations="corporations"
            :corporations-loading="corporationsLoading"
            :corporations-error="corporationsError"
            @new-personal-tax="openModal"
            @edit-personal-tax="openEditModal"
            @filter-personal-tax="handleFilter"
            @add-corporation="handleAddCorporation"
            @edit-corporation="handleEditCorporation"
          />
        </div>
      </div>
    </div>

    <TaskModal
      :visible="showTaskModal"
      :clientId="clientId"
      :task="modalTask"
      @close="closeModal"
      @saved="handleSave"
    />

    <CorporationModal
      :visible="showCorpModal"
      :editing="corpEditing"
      :corporation="modalCorp"
      :clientId="clientId"
      @close="closeCorpModal"
      @save="handleCorpSave"
    />

    <ClientModal
      :visible="showClientModal"
      :client="modalClient"
      :is-editing="clientEditing"
      @close="closeClientModal"
      @saved="handleClientSave"
    />

    <ClientModal
      :visible="showRelativeModal"
      :client="modalRelative"
      :is-editing="relativeEditing"
      :is-relative="true"
      :main-client-id="clientId"
      @close="closeRelativeModal"
      @saved="handleRelativeSave"
    />
  </div>
</template>