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

const fetchClients = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await apiGet('/api/clients')
    if (!res.success) throw new Error(res.error || 'Failed to load clients')
    clients.value = res.clients.map(c => ({ ...c, id: c._id || c.id }))
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading clients'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchClients)

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
  if (isEditing.value) {
    const idx = clients.value.findIndex(c => String(c.id) === String(saved.id))
    if (idx !== -1) {
      clients.value[idx] = saved
    } else {
      clients.value.push(saved)
    }
  } else {
    clients.value.push(saved)
  }
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <ClientsClientHeader :client-count="clients.length" @add-client="openAddModal" />

    <ClientsClientList
      :clients="clients"
      :loading="isLoading"
      :error="fetchError"
      @edit="openEditModal"
      @retry="fetchClients"
    />

    <ClientModal
      :visible="isModalOpen"
      :client="currentClient"
      :is-editing="isEditing"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>
