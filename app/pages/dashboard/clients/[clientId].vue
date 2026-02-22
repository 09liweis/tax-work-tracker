<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Client Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a tax client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const clientId = route.params.clientId

import ClientInfoCard from '~/components/ClientInfoCard.vue'
import PersonalTaxSection from '~/components/PersonalTaxSection.vue'
import TaskModal from '~/components/TaskModal.vue'
import CorporationModal from '~/components/CorporationModal.vue'

const client = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// personal tax management
const personalTaxes = ref([])
const personalTaxesLoading = ref(false)
const personalTaxesError = ref('')

// corporation state
const corporations = ref([])
const corporationsLoading = ref(false)
const corporationsError = ref('')

// modal state
const showTaskModal = ref(false)
const modalTask = ref(null)

// corporation modal state
const showCorpModal = ref(false)
const modalCorp = ref(null)
const corpEditing = ref(false)


const fetchClient = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load client')
    client.value = { ...res.client, id: res.client._id || res.client.id }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading client'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchClient()
  await fetchPersonalTaxes()
  await fetchCorporations()
})

const fetchPersonalTaxes = async () => {
  personalTaxesLoading.value = true
  personalTaxesError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/personalTax?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load personal tax records')
    personalTaxes.value = res.personalTaxes || []
  } catch (err) {
    personalTaxesError.value = err?.message || 'An error occurred while loading personal taxes'
  } finally {
    personalTaxesLoading.value = false
  }
}

const fetchCorporations = async () => {
  corporationsLoading.value = true
  corporationsError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/corporations?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load corporations')
    corporations.value = (res.corporations || []).map(c => ({ ...c, id: c._id || c.id }))
  } catch (err) {
    corporationsError.value = err?.message || 'An error occurred while loading corporations'
  } finally {
    corporationsLoading.value = false
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

// corporations modal handlers
const openAddCorpModal = () => {
  corpEditing.value = false
  modalCorp.value = null
  showCorpModal.value = true
}

const openEditCorpModal = (corp) => {
  corpEditing.value = true
  modalCorp.value = { ...corp }
  showCorpModal.value = true
}

const closeCorpModal = () => {
  showCorpModal.value = false
  modalCorp.value = null
}

const handleCorpSave = async (corpData) => {
  // send to backend upsert endpoint
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch('/api/corporations/upsert', {
      method: 'POST',
      body: corpData,
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to save corporation')
  } catch (err) {
    // could display error in UI; for now log
    console.error('Error saving corporation', err)
  }

  await fetchCorporations()
  closeCorpModal()
}

</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <ClientInfoCard
      :client="client"
      :isLoading="isLoading"
      :error="fetchError"
      @retry="fetchClient"
    />

    <template v-if="client">
      <PersonalTaxSection
        :personalTaxes="personalTaxes"
        :loading="personalTaxesLoading"
        :error="personalTaxesError"
        @new="openModal"
        @edit="openEditModal"
      />

      <!-- corporation list inside client details -->
      <div class="mt-10">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Corporations</h3>
          <button
            @click="openAddCorpModal"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Corporation
          </button>
        </div>

        <div v-if="corporationsLoading" class="text-sm text-gray-500">Loading...</div>
        <div v-else-if="corporationsError" class="text-sm text-red-500">{{ corporationsError }}</div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="corp in corporations" :key="corp._id" class="py-2 flex justify-between items-center">
            <span>{{ corp.name }}</span>
            <button @click="openEditCorpModal(corp)" class="text-indigo-600 text-sm hover:underline">Edit</button>
          </li>
          <li v-if="corporations.length === 0" class="text-sm text-gray-500">No corporations added yet.</li>
        </ul>
      </div>
    </template>

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
  </div>
</template>