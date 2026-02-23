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

const clients = ref([])
const isLoading = ref(true)
const fetchError = ref('')

const fetchClients = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch('/api/clients', {
      headers: { Authorization: `Bearer ${token}` }
    })
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
const currentClient = ref({
  id: null,
  name: '',
  dob: '',
  sin: '',
  telephone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  maritalStatus: '',
  gender: '',
  status: 'Active'
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  currentClient.value = {
    id: null,
    name: '',
    dob: '',
    sin: '',
    telephone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    maritalStatus: '',
    gender: '',
    status: 'Active'
  }
  isModalOpen.value = true
}

const openEditModal = (client) => {
  isEditing.value = true
  currentClient.value = { ...client, id: client.id || client._id }
  // ensure address field exists when editing older clients
  if (!currentClient.value.address) currentClient.value.address = ''
  isModalOpen.value = true
}

const saveClient = async () => {
  try {
    const token = localStorage.getItem('token')
    const payload = { ...currentClient.value }
    const res = await $fetch('/api/clients/upsert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
    if (!res.success) throw new Error(res.error || 'Save failed')

    const saved = { ...res.client, id: res.client._id || res.client.id }

    if (isEditing.value) {
      const idx = clients.value.findIndex(c => String(c.id) === String(saved.id))
      if (idx !== -1) clients.value[idx] = saved
      else clients.value.push(saved)
    } else {
      clients.value.push(saved)
    }

    isModalOpen.value = false
  } catch (err) {
    alert(err?.message || 'Error saving client')
  }
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

  <!-- Modal -->
  <div v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Edit Client' : 'Add New Client' }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ isEditing ? 'Update client information' : 'Enter client details' }}</p>
      </div>
      <form @submit.prevent="saveClient" class="px-6 py-6">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input id="name" v-model="currentClient.name" type="text" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
              placeholder="Enter client's full name">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="dob" class="block text-sm font-semibold text-gray-700 mb-2">DOB</label>
              <input id="dob" v-model="currentClient.dob" type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="sin" class="block text-sm font-semibold text-gray-700 mb-2">SIN</label>
              <input id="sin" v-model="currentClient.sin" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="SIN">
            </div>
          </div>

          <div>
            <label for="telephone" class="block text-sm font-semibold text-gray-700 mb-2">Telephone No.</label>
            <input id="telephone" v-model="currentClient.telephone" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., +1 555-555-5555">
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input id="email" v-model="currentClient.email" type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="client@example.com">
          </div>

          <div>
            <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input id="address" v-model="currentClient.address" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Street address, PO box, etc.">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input id="city" v-model="currentClient.city" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="province" class="block text-sm font-semibold text-gray-700 mb-2">Province</label>
              <input id="province" v-model="currentClient.province" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="maritalStatus" class="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
              <select id="maritalStatus" v-model="currentClient.maritalStatus"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label for="gender" class="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select id="gender" v-model="currentClient.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeModal"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            Cancel
          </button>
          <button type="submit"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm">
            {{ isEditing ? 'Update Client' : 'Add Client' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>