<script setup>
import { ref, onMounted } from 'vue'
import PersonalTaxServiceList from '~/components/PersonalTaxServiceList.vue'
import PersonalTaxServiceModal from '~/components/PersonalTaxServiceModal.vue'
import { useUser } from '~/composables/useUser'
import { apiGet, apiDelete } from '~/utils/api'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Personal Tax Services - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Manage personal tax services and pricing.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const services = ref([])
const isLoading = ref(true)
const fetchError = ref('')

const { loginUser } = useUser()
const isAdmin = ref(false)

const fetchServices = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await apiGet('/api/personal-tax-services')
    if (!res.success) throw new Error(res.error || 'Failed to load services')
    services.value = res.services
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading services'
  } finally {
    isLoading.value = false
  }
}

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentService = ref(null)

const openAddModal = () => {
  isEditing.value = false
  currentService.value = null
  isModalOpen.value = true
}

const openEditModal = (service) => {
  isEditing.value = true
  currentService.value = { ...service }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSaved = () => {
  fetchServices()
  closeModal()
}

const deleteService = async (id) => {
  if (!confirm('Are you sure you want to delete this service?')) return
  try {
    const res = await apiDelete(`/api/personal-tax-services/${id}`)
    if (!res.success) throw new Error(res.error || 'Delete failed')
    services.value = services.value.filter(s => String(s.id) !== String(id))
  } catch (err) {
    alert(err?.message || 'Unable to delete service')
  }
}

onMounted(async () => {
  isAdmin.value = loginUser.value?.role === 'admin'
  await fetchServices()
})
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Services</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage personal tax services and pricing.</p>
          </div>
          <button
            v-if="isAdmin"
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Service
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="px-4 py-10 text-center text-gray-500">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Loading services...
      </div>
      <div v-else-if="fetchError" class="px-4 py-6">
        <div class="rounded-md bg-red-50 p-4 flex items-center justify-between">
          <p class="text-sm text-red-700">{{ fetchError }}</p>
          <button @click="fetchServices" class="text-sm text-red-600 font-medium hover:text-red-500 underline ml-4">Retry</button>
        </div>
      </div>
      <div v-else>
        <PersonalTaxServiceList
          :services="services"
          :isAdmin="isAdmin"
          @edit="openEditModal"
          @delete="deleteService"
        />
      </div>
    </div>

    <PersonalTaxServiceModal
      :visible="isModalOpen"
      :service="currentService"
      :isEditing="isEditing"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>
