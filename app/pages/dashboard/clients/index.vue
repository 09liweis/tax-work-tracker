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
import ClientModal from '~/components/ClientModal.vue'

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
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Client List</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your tax clients and their information.</p>
          </div>
          <button @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Client
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="px-4 py-10 text-center text-gray-500">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Loading clients...
      </div>

      <!-- Error state -->
      <div v-else-if="fetchError" class="px-4 py-6">
        <div class="rounded-md bg-red-50 p-4 flex items-center justify-between">
          <p class="text-sm text-red-700">{{ fetchError }}</p>
          <button @click="fetchClients" class="text-sm text-red-600 font-medium hover:text-red-500 underline ml-4">Retry</button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="clients.length === 0" class="px-4 py-10 text-center text-gray-500 text-sm">
        No clients found. Add your first client to get started.
      </div>

      <!-- Client list -->
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="client in clients" :key="client.id">
          <NuxtLink :to="`/dashboard/clients/${client.id}`" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ client.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                    <div class="text-sm text-gray-500">
                      <span>{{ client.email || '—' }}</span>
                      <template v-if="client.address">
                        <span class="block">{{ client.address }}</span>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    :class="client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ client.status }}
                  </span>
                  <button @click.stop="openEditModal(client)"
                    class="text-indigo-600 hover:text-indigo-500 text-sm">Edit</button>
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>

  <ClientModal
    :visible="isModalOpen"
    :client="currentClient"
    :is-editing="isEditing"
    @close="closeModal"
    @saved="handleSaved"
  />
</template>