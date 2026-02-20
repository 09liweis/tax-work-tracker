<script setup>
definePageMeta({
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

// Sample client data (in a real app, this would come from an API)
const clients = [
  { id: 1, name: 'John Doe', type: 'Individual', email: 'john.doe@email.com', status: 'Active', lastContact: '2 days ago', phone: '(555) 123-4567', address: '123 Main St, Anytown, USA', taxId: '123-45-6789', notes: 'Regular client, files annually.' },
  { id: 2, name: 'Jane Smith', type: 'Individual', email: 'jane.smith@email.com', status: 'Active', lastContact: '1 week ago', phone: '(555) 987-6543', address: '456 Oak Ave, Somewhere, USA', taxId: '987-65-4321', notes: 'New client, first year filing.' },
  { id: 3, name: 'ABC Corp', type: 'Business', email: 'contact@abc-corp.com', status: 'Active', lastContact: '3 days ago', phone: '(555) 555-1234', address: '789 Business Blvd, Corp City, USA', taxId: '12-3456789', notes: 'Corporate client, quarterly filings.' },
  { id: 4, name: 'XYZ LLC', type: 'Business', email: 'info@xyz-llc.com', status: 'Inactive', lastContact: '2 months ago', phone: '(555) 555-5678', address: '321 Enterprise Dr, Biz Town, USA', taxId: '98-7654321', notes: 'Inactive client, contact for reactivation.' },
  { id: 5, name: 'Mike Johnson', type: 'Individual', email: 'mike.j@email.com', status: 'Active', lastContact: '5 days ago', phone: '(555) 246-8135', address: '654 Pine St, Elsewhere, USA', taxId: '456-78-9123', notes: 'Long-time client, complex returns.' }
]

const client = clients.find(c => c.id === parseInt(clientId))

// If client not found, redirect to clients list
if (!client) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Client not found'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink to="/dashboard/clients" class="text-indigo-600 hover:text-indigo-500 mr-4">
              ← Back to Clients
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">{{ client.name }}</h1>
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
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Client Information</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this client.</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Full name</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.name }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.type }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.email }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.phone }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.address }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Tax ID</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.taxId }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    :class="client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ client.status }}
                  </span>
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Last Contact</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.lastContact }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.notes }}</dd>
              </div>
            </dl>
          </div>
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