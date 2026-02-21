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

// Sample client data
const clients = ref([
  { id: 1, name: 'John Doe', type: 'Individual', email: 'john.doe@email.com', status: 'Active', lastContact: '2 days ago' },
  { id: 2, name: 'Jane Smith', type: 'Individual', email: 'jane.smith@email.com', status: 'Active', lastContact: '1 week ago' },
  { id: 5, name: 'Mike Johnson', type: 'Individual', email: 'mike.j@email.com', status: 'Active', lastContact: '5 days ago' }
])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentClient = ref({ id: null, name: '', type: 'Individual', email: '', status: 'Active', lastContact: '' })

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  currentClient.value = { id: null, name: '', type: 'Individual', email: '', status: 'Active', lastContact: '' }
  isModalOpen.value = true
}

const openEditModal = (client) => {
  isEditing.value = true
  currentClient.value = { ...client }
  isModalOpen.value = true
}

const saveClient = () => {
  if (isEditing.value) {
    const index = clients.value.findIndex(c => c.id === currentClient.value.id)
    clients.value[index] = { ...currentClient.value }
  } else {
    const newId = Math.max(...clients.value.map(c => c.id)) + 1
    clients.value.push({ ...currentClient.value, id: newId })
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
      <ul role="list" class="divide-y divide-gray-200">
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
                    <div class="text-sm text-gray-500">{{ client.type }} • {{ client.email }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-sm text-gray-500">Last contact: {{ client.lastContact }}</div>
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
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input id="name" v-model="currentClient.name" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
              placeholder="Enter client's full name" required>
          </div>
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input id="email" v-model="currentClient.email" type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
              placeholder="client@example.com" required>
          </div>
          <div>
            <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select id="status" v-model="currentClient.status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label for="lastContact" class="block text-sm font-semibold text-gray-700 mb-2">Last Contact</label>
            <input id="lastContact" v-model="currentClient.lastContact" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
              placeholder="e.g., 2 days ago">
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-8">
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