<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View your tax work dashboard with client statistics, recent activities, and project management tools.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Sample data for CRM-style dashboard
const stats = [
  { title: 'Total Clients', value: '1,234', change: '+12%', icon: '👥' },
  { title: 'Active Projects', value: '56', change: '+5%', icon: '📋' },
  { title: 'Revenue This Month', value: '$45,678', change: '+8%', icon: '💰' },
  { title: 'Pending Tasks', value: '23', change: '-2%', icon: '⏳' }
]

const recentActivities = [
  { client: 'John Doe', action: 'Submitted tax documents', time: '2 hours ago' },
  { client: 'Jane Smith', action: 'Scheduled consultation', time: '4 hours ago' },
  { client: 'Bob Johnson', action: 'Payment received', time: '1 day ago' },
  { client: 'Alice Brown', action: 'Updated profile', time: '2 days ago' }
]
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.title" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="text-3xl">{{ stat.icon }}</div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.title }}</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
              </dl>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span class="text-green-600 font-medium">{{ stat.change }}</span>
              <span class="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions / Sections -->
    <div class="mt-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Manage</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NuxtLink to="/dashboard/employees"
          class="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="text-4xl">👥</div>
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">Employees</h4>
              <p class="text-sm text-gray-500">Manage your team members</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/dashboard/clients"
          class="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="text-4xl">🤝</div>
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">Clients</h4>
              <p class="text-sm text-gray-500">View and manage clients</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/dashboard/corporations"
          class="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="text-4xl">🏢</div>
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">Corporations</h4>
              <p class="text-sm text-gray-500">Handle corporate accounts</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
