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
const corporations = [
  { id: 1, name: 'TechCorp Inc.', industry: 'Technology', taxId: '12-3456789', status: 'Active', revenue: '$2.5M' },
  { id: 2, name: 'Global Solutions LLC', industry: 'Consulting', taxId: '98-7654321', status: 'Active', revenue: '$1.8M' },
  { id: 3, name: 'Manufacturing Plus', industry: 'Manufacturing', taxId: '45-6789012', status: 'Under Review', revenue: '$3.2M' },
  { id: 4, name: 'Retail Chain Co.', industry: 'Retail', taxId: '67-8901234', status: 'Active', revenue: '$4.1M' },
  { id: 5, name: 'Finance Group', industry: 'Financial Services', taxId: '23-4567890', status: 'Active', revenue: '$5.7M' }
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
            <h1 class="text-2xl font-bold text-gray-900">Corporations</h1>
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Accounts</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your corporate clients and their tax information.</p>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="corp in corporations" :key="corp.id">
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
                  </div>
                </div>
              </div>
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