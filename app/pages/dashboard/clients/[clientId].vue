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
import ClientTabs from '~/components/client/ClientTabs.vue'
import ClientModal from '~/components/client/ClientModal.vue'
import RelativesSection from '~/components/client/RelativesSection.vue'
import PersonalTaxSection from '~/components/PersonalTaxSection.vue'
import CorporationList from '~/components/corporation/CorporationList.vue'
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
        :relatives-count="relatives.length"
      />

      <!-- Main Content Area -->
      <div class="space-y-6">
        <!-- Personal Tax Tab -->
        <div v-if="activeTab === 'personal-tax'">
          <PersonalTaxSection
            :personal-taxes="personalTaxes"
            :loading="personalTaxesLoading"
            :error="personalTaxesError"
            :selected-year="filterYear"
            @new="openModal"
            @edit="openEditModal"
            @filter="handleFilter"
          />
        </div>

        <!-- Corporations Tab -->
        <div v-if="activeTab === 'corporations'">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Corporations
                </h2>
                <Button @click="handleAddCorporation" variant="info">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Corporation
                </Button>
              </div>
            </div>

            <div v-if="corporationsLoading" class="px-6 py-12 text-center">
              <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <p class="text-gray-600">Loading corporations</p>
            </div>

            <div v-else-if="corporationsError" class="px-6 py-6">
              <div class="rounded-md bg-red-50 p-4 text-sm text-red-700">{{ corporationsError }}</div>
            </div>

            <div v-else-if="corporations.length === 0" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No corporations</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by adding a corporation.</p>
            </div>

            <div v-else>
              <CorporationList :corporations="corporations" @edit="handleEditCorporation" />
            </div>
          </div>
        </div>

        <!-- Relatives Tab -->
        <div v-if="activeTab === 'relatives'">
          <RelativesSection
            :relatives="relatives"
            :loading="relativesLoading"
            :error="relativesError"
            @new="handleAddRelative"
            @edit="handleEditRelative"
            @delete="handleDeleteRelative"
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