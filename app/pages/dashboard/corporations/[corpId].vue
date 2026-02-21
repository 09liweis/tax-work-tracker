<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Corporation Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a corporate client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const corpId = route.params.corpId

// Sample corporation data (in a real app, this would come from an API)
const corporations = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    industry: 'Technology',
    taxId: '12-3456789',
    status: 'Active',
    revenue: '$2.5M',
    phone: '(555) 123-4567',
    address: '123 Tech Blvd, Silicon Valley, CA',
    founded: '2015',
    employees: 150,
    notes: 'Growing tech company, specializes in AI solutions.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-20', amount: 125000 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-15', amount: 98000 },
      { year: 2021, status: 'Filed', dueDate: '2022-04-15', filedDate: '2022-04-10', amount: 75000 }
    ],
    owners: [
      { id: 1, name: 'John Doe', role: 'CEO', ownership: '60%' },
      { id: 2, name: 'Jane Smith', role: 'CTO', ownership: '25%' },
      { id: 5, name: 'Mike Johnson', role: 'CFO', ownership: '15%' }
    ]
  },
  {
    id: 2,
    name: 'Global Solutions LLC',
    industry: 'Consulting',
    taxId: '98-7654321',
    status: 'Active',
    revenue: '$1.8M',
    phone: '(555) 987-6543',
    address: '456 Business Park, Consulting City, NY',
    founded: '2018',
    employees: 45,
    notes: 'Management consulting firm, focuses on digital transformation.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-04-12', amount: 87500 }
    ],
    owners: [
      { id: 2, name: 'Jane Smith', role: 'Managing Partner', ownership: '70%' },
      { id: 5, name: 'Mike Johnson', role: 'Partner', ownership: '30%' }
    ]
  },
  {
    id: 3,
    name: 'Manufacturing Plus',
    industry: 'Manufacturing',
    taxId: '45-6789012',
    status: 'Under Review',
    revenue: '$3.2M',
    phone: '(555) 555-1234',
    address: '789 Industrial Way, Factory Town, MI',
    founded: '2010',
    employees: 200,
    notes: 'Manufacturing company under review for compliance issues.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-28', amount: 156000 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-30', amount: 142000 }
    ],
    owners: [
      { id: 1, name: 'John Doe', role: 'President', ownership: '100%' }
    ]
  },
  {
    id: 4,
    name: 'Retail Chain Co.',
    industry: 'Retail',
    taxId: '67-8901234',
    status: 'Active',
    revenue: '$4.1M',
    phone: '(555) 555-5678',
    address: '321 Commerce St, Retail City, TX',
    founded: '2005',
    employees: 300,
    notes: 'Regional retail chain with multiple locations.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-10', amount: 210000 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-05', amount: 195000 }
    ],
    owners: [
      { id: 5, name: 'Mike Johnson', role: 'CEO', ownership: '80%' }
    ]
  },
  {
    id: 5,
    name: 'Finance Group',
    industry: 'Financial Services',
    taxId: '23-4567890',
    status: 'Active',
    revenue: '$5.7M',
    phone: '(555) 246-8135',
    address: '654 Finance Plaza, Money City, NY',
    founded: '2000',
    employees: 120,
    notes: 'Financial services firm, specializes in investment management.',
    taxReturns: [
      { year: 2023, status: 'Filed', dueDate: '2024-04-15', filedDate: '2024-03-12', amount: 320000 },
      { year: 2022, status: 'Filed', dueDate: '2023-04-15', filedDate: '2023-03-08', amount: 285000 },
      { year: 2021, status: 'Filed', dueDate: '2022-04-15', filedDate: '2022-03-14', amount: 250000 }
    ],
    owners: [
      { id: 2, name: 'Jane Smith', role: 'Managing Director', ownership: '65%' },
      { id: 5, name: 'Mike Johnson', role: 'Director', ownership: '35%' }
    ]
  }
]

const corporation = corporations.find(c => c.id === parseInt(corpId))
console.log('Corporation ID from route:', corpId)
console.log('Found corporation:', corporation)

// If corporation not found, redirect to corporations list
if (!corporation) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Corporation not found'
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
            <NuxtLink to="/dashboard/corporations" class="text-indigo-600 hover:text-indigo-500 mr-4">
              ← Back to Corporations
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">{{ corporation.name }}</h1>
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporation Information</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this corporate client.</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Company Name</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.name }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Industry</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.industry }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Tax ID</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.taxId }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.phone }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.address }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Founded</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.founded }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Employees</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.employees }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Annual Revenue</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.revenue }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    :class="corporation.status === 'Active' ? 'bg-green-100 text-green-800' : corporation.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ corporation.status }}
                  </span>
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ corporation.notes }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Corporate Tax Returns Section -->
        <div v-if="corporation.taxReturns && corporation.taxReturns.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Tax Returns</h3>
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
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="taxReturn in corporation.taxReturns" :key="taxReturn.year">
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

        <!-- Owners/Directors Section -->
        <div v-if="corporation.owners && corporation.owners.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Owners & Directors</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Key individuals associated with this corporation.</p>
          </div>
          <div class="border-t border-gray-200">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="owner in corporation.owners" :key="owner.id">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">{{ owner.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <NuxtLink :to="`/dashboard/clients/${owner.id}`" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          {{ owner.name }}
                        </NuxtLink>
                        <div class="text-sm text-gray-500">{{ owner.role }}</div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      Ownership: {{ owner.ownership }}
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