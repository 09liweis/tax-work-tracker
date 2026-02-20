<script setup>
definePageMeta({
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
const clients = [
  { id: 1, name: 'John Doe', type: 'Individual', email: 'john.doe@email.com', status: 'Active', lastContact: '2 days ago' },
  { id: 2, name: 'Jane Smith', type: 'Individual', email: 'jane.smith@email.com', status: 'Active', lastContact: '1 week ago' },
  { id: 3, name: 'ABC Corp', type: 'Business', email: 'contact@abc-corp.com', status: 'Active', lastContact: '3 days ago' },
  { id: 4, name: 'XYZ LLC', type: 'Business', email: 'info@xyz-llc.com', status: 'Inactive', lastContact: '2 months ago' },
  { id: 5, name: 'Mike Johnson', type: 'Individual', email: 'mike.j@email.com', status: 'Active', lastContact: '5 days ago' }
]
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
            <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Client List</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your tax clients and their information.</p>
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
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ client.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      if (process.client) {
        localStorage.removeItem('authenticated')
        this.$router.push('/login')
      }
    }
  }
}
</script>