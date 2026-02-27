<script setup>
import { ref, onMounted } from 'vue'
import { apiGet, apiPost, apiPut, apiDelete } from '~/utils/api'
import PayrollServiceModal from '~/components/PayrollServiceModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Payroll Services - Admin',
  meta: [
    { name: 'description', content: 'Manage payroll services' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const services = ref([])
const showModal = ref(false)
const editingService = ref(null)
const loading = ref(true)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const fetchServices = async () => {
  loading.value = true
  try {
    const res = await apiGet('/api/payroll-services')
    if (res.success) {
      services.value = res.services
    }
  } catch (error) {
    console.error('Failed to fetch payroll services:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editingService.value = null
  showModal.value = true
}

const openEditModal = (service) => {
  editingService.value = service
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingService.value = null
}

const handleSave = async (payload) => {
  try {
    if (editingService.value) {
      await apiPut(`/api/payroll-services/${editingService.value._id}`, payload)
    } else {
      await apiPost('/api/payroll-services', payload)
    }
    await fetchServices()
    closeModal()
  } catch (error) {
    console.error('Failed to save payroll service:', error)
  }
}

const handleDelete = async (serviceId) => {
  if (!confirm('Are you sure you want to delete this payroll service?')) {
    return
  }

  try {
    await apiDelete(`/api/payroll-services/${serviceId}`)
    await fetchServices()
  } catch (error) {
    console.error('Failed to delete payroll service:', error)
  }
}

onMounted(fetchServices)
</script>

<template>
  <div class="px-4 sm:px-6 py-4 sm:py-6">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Payroll Services</h1>
      <p class="mt-2 text-slate-500 text-sm sm:text-base">Manage your payroll service offerings</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16 sm:py-20">
      <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Add Service Button -->
      <div class="mb-4 sm:mb-6">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Service
        </button>
      </div>

      <!-- Services List -->
      <div v-if="services.length === 0" class="text-center py-12 sm:py-16 bg-white rounded-xl border border-slate-200">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-slate-500 text-sm sm:text-base">No payroll services yet</p>
        <p class="text-slate-400 text-xs sm:text-sm mt-1">Click "Add Service" to create your first service</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="service in services"
          :key="service._id"
          class="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-sm transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-semibold text-slate-900 truncate">{{ service.name }}</h3>
                <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 flex-shrink-0">
                  {{ formatCurrency(service.price) }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="openEditModal(service)"
                class="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
              <button
                @click="handleDelete(service._id)"
                class="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal -->
    <PayrollServiceModal
      :show="showModal"
      :service="editingService"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
