<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Corporations - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Handle corporate accounts and business clients in the tax work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Sample corporation data
const corporations = ref([
  { id: 1, name: 'TechCorp Inc.', industry: 'Technology', taxId: '12-3456789', status: 'Active', revenue: '$2.5M' },
  { id: 2, name: 'Global Solutions LLC', industry: 'Consulting', taxId: '98-7654321', status: 'Active', revenue: '$1.8M' },
  { id: 3, name: 'Manufacturing Plus', industry: 'Manufacturing', taxId: '45-6789012', status: 'Under Review', revenue: '$3.2M' },
  { id: 4, name: 'Retail Chain Co.', industry: 'Retail', taxId: '67-8901234', status: 'Active', revenue: '$4.1M' },
  { id: 5, name: 'Finance Group', industry: 'Financial Services', taxId: '23-4567890', status: 'Active', revenue: '$5.7M' }
])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCorporation = ref({ id: null, name: '', industry: '', taxId: '', status: 'Active', revenue: '' })

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  currentCorporation.value = { id: null, name: '', industry: '', taxId: '', status: 'Active', revenue: '' }
  isModalOpen.value = true
}

const openEditModal = (corp) => {
  isEditing.value = true
  currentCorporation.value = { ...corp }
  isModalOpen.value = true
}

const saveCorporation = () => {
  if (isEditing.value) {
    const index = corporations.value.findIndex(c => c.id === currentCorporation.value.id)
    corporations.value[index] = { ...currentCorporation.value }
  } else {
    const newId = Math.max(...corporations.value.map(c => c.id)) + 1
    corporations.value.push({ ...currentCorporation.value, id: newId })
  }
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}

const logout = () => {
  if (process.client) {
    localStorage.removeItem('authenticated')
    navigateTo('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="text-indigo-600 hover:text-indigo-500 mr-4">
              ← Back to Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Corporations</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="openAddModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Corporation
            </button>
            <button
              @click="logout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Accounts</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your corporate clients and their tax information.</p>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="corp in corporations" :key="corp.id">
              <NuxtLink :to="`/dashboard/corporations/${corp.id}`" class="block hover:bg-gray-50">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">{{ corp.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ corp.name }}</div>
                        <div class="text-sm text-gray-500">{{ corp.industry }} • Tax ID: {{ corp.taxId }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="text-sm text-gray-900 font-medium">{{ corp.revenue }}</div>
                      <span
                        :class="corp.status === 'Active' ? 'bg-green-100 text-green-800' : corp.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ corp.status }}
                      </span>
                      <button @click.stop="openEditModal(corp)" class="text-indigo-600 hover:text-indigo-500 text-sm">Edit</button>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Edit Corporation' : 'Add New Corporation' }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ isEditing ? 'Update corporation information' : 'Enter corporation details' }}</p>
        </div>
        <form @submit.prevent="saveCorporation" class="px-6 py-6">
          <div class="space-y-6">
            <div>
              <label for="corpName" class="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input
                id="corpName"
                v-model="currentCorporation.name"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="Enter company name"
                required
              >
            </div>
            <div>
              <label for="industry" class="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select
                id="industry"
                v-model="currentCorporation.industry"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
                required
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Consulting">Consulting</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label for="taxId" class="block text-sm font-semibold text-gray-700 mb-2">Tax ID</label>
              <input
                id="taxId"
                v-model="currentCorporation.taxId"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="XX-XXXXXXX"
                required
              >
            </div>
            <div>
              <label for="corpStatus" class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                id="corpStatus"
                v-model="currentCorporation.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label for="revenue" class="block text-sm font-semibold text-gray-700 mb-2">Annual Revenue</label>
              <input
                id="revenue"
                v-model="currentCorporation.revenue"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="e.g., $2.5M"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
            >
              {{ isEditing ? 'Update Corporation' : 'Add Corporation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>