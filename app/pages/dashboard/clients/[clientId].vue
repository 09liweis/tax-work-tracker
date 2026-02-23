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
import CorporationList from '~/components/CorporationList.vue'

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
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-800 font-medium">{{ fetchError }}</p>
          </div>
          <button @click="fetchClient" class="text-sm text-red-600 font-medium hover:text-red-500 underline">Retry</button>
        </div>
      </div>
    </div>

    <!-- Client Details -->
    <div v-else-if="client" class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Hero Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-10">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-5">
              <div class="h-24 w-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                <span class="text-4xl font-bold text-white">{{ client.name.charAt(0) }}</span>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">{{ client.name }}</h1>
                <div class="flex items-center space-x-4 text-blue-100">
                  <span v-if="client.email" class="flex items-center text-sm">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {{ client.email }}
                  </span>
                  <span v-if="client.telephone" class="flex items-center text-sm">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {{ client.telephone }}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span
                :class="{
                  'bg-green-500 text-white': client.status === 'Active',
                  'bg-yellow-500 text-white': client.status !== 'Active'
                }"
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                <span class="w-2 h-2 rounded-full mr-2 bg-white"></span>
                {{ client.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200">
          <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Personal Tax Records</div>
                <div class="text-2xl font-bold text-gray-900">{{ personalTaxes.length }}</div>
              </div>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Corporations</div>
                <div class="text-2xl font-bold text-gray-900">{{ corporations.length }}</div>
              </div>
              <div class="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SIN</div>
                <div class="text-lg font-semibold text-gray-900">{{ client.sin || '—' }}</div>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</div>
                <div class="text-lg font-semibold text-gray-900">{{ client.dob ? new Date(client.dob).toLocaleDateString() : '—' }}</div>
              </div>
              <div class="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Personal Information
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Marital Status</label>
                <p class="mt-1 text-sm text-gray-900">{{ client.maritalStatus || '—' }}</p>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
                <p class="mt-1 text-sm text-gray-900">{{ client.gender || '—' }}</p>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                <p class="mt-1 text-sm text-gray-900">{{ client.address || '—' }}</p>
                <p v-if="client.city || client.province" class="mt-1 text-sm text-gray-900">
                  {{ [client.city, client.province].filter(Boolean).join(', ') }}
                </p>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</label>
                <p class="mt-1 text-sm text-gray-900">{{ client.lts ? new Date(client.lts).toLocaleString() : '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Tax Records -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Personal Tax Records
                </h2>
                <button
                  @click="openModal"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  New Record
                </button>
              </div>
            </div>

            <div v-if="personalTaxesLoading" class="px-6 py-12 text-center">
              <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <p class="text-gray-600">Loading tax records</p>
            </div>

            <div v-else-if="personalTaxesError" class="px-6 py-6">
              <div class="rounded-md bg-red-50 p-4 text-sm text-red-700">{{ personalTaxesError }}</div>
            </div>

            <div v-else-if="personalTaxes.length === 0" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No tax records</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating a new tax record.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="task in personalTaxes" :key="task._id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.taskDescription || '—' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.taxYear || '—' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ task.status || 'Pending' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.priority || '—' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button @click="openEditModal(task)" class="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Corporations -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Corporations
                </h2>
                <button
                  @click="openAddCorpModal"
                  class="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Corporation
                </button>
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
              <CorporationList :corporations="corporations" />
            </div>
          </div>
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
  </div>
</template>