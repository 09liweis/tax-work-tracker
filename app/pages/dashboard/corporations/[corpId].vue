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
        <!-- Corporation Card -->
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-8">
          <div class="flex items-center px-6 py-6">
            <div class="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ corporation.name.charAt(0) }}</span>
            </div>
            <div class="ml-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ corporation.name }}</h2>
              <div class="mt-1 text-sm text-gray-500">{{ corporation.industry }}</div>
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="flex flex-wrap gap-4">
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Tax ID:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.taxId }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Status:</span>
                <span :class="corporation.status === 'Active' ? 'bg-green-100 text-green-800' : corporation.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2">
                  {{ corporation.status }}
                </span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Annual Revenue:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.revenue }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Phone:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.phone }}</span>
              </div>
              <div class="w-full">
                <span class="text-xs font-semibold text-gray-500">Address:</span>
                <span class="ml-2 text-sm text-gray-900">{{ corporation.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Corporate Tax Returns Section (optional, can be removed for minimalism) -->
        <!-- ...existing code... -->

        <!-- Owners/Directors Section (optional, can be removed for minimalism) -->
        <!-- ...existing code... -->
  </div>
</template>