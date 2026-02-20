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
  { 
    id: 1, 
    name: 'John Doe', 
    type: 'Individual', 
    email: 'john.doe@email.com', 
    status: 'Active', 
    lastContact: '2 days ago', 
    phone: '(555) 123-4567', 
    address: '123 Main St, Anytown, USA', 
    taxId: '123-45-6789', 
    notes: 'Regular client, files annually.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-20', amount: 15250 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-15', amount: 12800 },
      { year: 2021, status: 'Filed', dueDate: '2022-04-15', filedDate: '2022-04-10', amount: 18900 }
    ],
    corporations: [
      { id: 3, name: 'ABC Corp', role: 'Owner/CEO', ownership: '75%' }
    ]
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    type: 'Individual', 
    email: 'jane.smith@email.com', 
    status: 'Active', 
    lastContact: '1 week ago', 
    phone: '(555) 987-6543', 
    address: '456 Oak Ave, Somewhere, USA', 
    taxId: '987-65-4321', 
    notes: 'New client, first year filing.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-04-12', amount: 8750 }
    ],
    corporations: []
  },
  { 
    id: 3, 
    name: 'ABC Corp', 
    type: 'Business', 
    email: 'contact@abc-corp.com', 
    status: 'Active', 
    lastContact: '3 days ago', 
    phone: '(555) 555-1234', 
    address: '789 Business Blvd, Corp City, USA', 
    taxId: '12-3456789', 
    notes: 'Corporate client, quarterly filings.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-28', amount: 45000 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-30', amount: 52000 }
    ],
    corporations: []
  },
  { 
    id: 4, 
    name: 'XYZ LLC', 
    type: 'Business', 
    email: 'info@xyz-llc.com', 
    status: 'Inactive', 
    lastContact: '2 months ago', 
    phone: '(555) 555-5678', 
    address: '321 Enterprise Dr, Biz Town, USA', 
    taxId: '98-7654321', 
    notes: 'Inactive client, contact for reactivation.',
    taxReturns: [
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-04-14', amount: 28000 }
    ],
    corporations: []
  },
  { 
    id: 5, 
    name: 'Mike Johnson', 
    type: 'Individual', 
    email: 'mike.j@email.com', 
    status: 'Active', 
    lastContact: '5 days ago', 
    phone: '(555) 246-8135', 
    address: '654 Pine St, Elsewhere, USA', 
    taxId: '456-78-9123', 
    notes: 'Long-time client, complex returns.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-10', amount: 35600 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-05', amount: 41200 },
      { year: 2021, status: 'Filed', dueDate: '2022-04-15', filedDate: '2022-03-12', amount: 38900 },
      { year: 2020, status: 'Filed', dueDate: '2021-04-15', filedDate: '2021-03-08', amount: 29800 }
    ],
    corporations: [
      { id: 4, name: 'XYZ LLC', role: 'Managing Member', ownership: '60%' }
    ]
  }
]

const client = clients.find(c => c.id === parseInt(clientId))

// If client not found, redirect to clients list
if (!client) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Client not found'
  })
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

        <!-- Personal Tax Returns Section (only for individuals) -->
        <div v-if="client.type === 'Individual' && client.taxReturns && client.taxReturns.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Returns</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Tax filing history by year.</p>
          </div>
          <div class="border-t border-gray-200">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Year</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filed Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="taxReturn in client.taxReturns" :key="taxReturn.year">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ taxReturn.year }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="taxReturn.status === 'Filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ taxReturn.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ taxReturn.dueDate }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ taxReturn.filedDate }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ taxReturn.amount.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Associated Corporations Section -->
        <div v-if="client.corporations && client.corporations.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Associated Corporations</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Business entities associated with this client.</p>
          </div>
          <div class="border-t border-gray-200">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="corp in client.corporations" :key="corp.id">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">{{ corp.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <NuxtLink :to="`/dashboard/clients/${corp.id}`" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          {{ corp.name }}
                        </NuxtLink>
                        <div class="text-sm text-gray-500">{{ corp.role }}</div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      Ownership: {{ corp.ownership }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>