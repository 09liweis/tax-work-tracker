<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUser } from '~/composables/useUser'

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

const { loginUser } = useUser()
const isAdmin = computed(() => loginUser.value?.role === 'admin')

const stats = ref({
  totalClients: 0,
  totalCorporations: 0,
  pendingTasks: 0,
  completedTasks: 0,
  totalRevenue: 0,
  employees: 0
})

const recentClients = ref([])
const upcomingDeadlines = ref([])
const loading = ref(true)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')

    const [clientsRes, corpsRes, personalTaxRes, corpTaxRes, usersRes] = await Promise.all([
      $fetch('/api/clients', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/corporations', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/personalTax', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/corporationTax', { headers: { Authorization: `Bearer ${token}` } }),
      isAdmin.value ? $fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ success: true, users: [] })
    ])

    if (clientsRes.success) {
      stats.value.totalClients = clientsRes.clients.length
      recentClients.value = clientsRes.clients
        .sort((a, b) => new Date(b.lts || b.ts) - new Date(a.lts || a.ts))
        .slice(0, 5)
    }

    if (corpsRes.success) {
      stats.value.totalCorporations = corpsRes.corporations.length
    }

    if (usersRes.success) {
      stats.value.employees = usersRes.users.length
    }

    if (personalTaxRes.success) {
      const tasks = personalTaxRes.personalTaxes || []
      const pending = tasks.filter(t => !t.completed)
      const completed = tasks.filter(t => t.completed)

      stats.value.pendingTasks += pending.length
      stats.value.completedTasks += completed.length

      const paidTasks = tasks.filter(t => t.paid && t.payment)
      stats.value.totalRevenue += paidTasks.reduce((sum, t) => sum + (parseFloat(t.payment) || 0), 0)

      const upcoming = tasks
        .filter(t => !t.completed && t.targetDueDate)
        .map(t => ({
          type: 'Personal Tax',
          description: t.taskDescription,
          clientId: t.clientId,
          dueDate: t.targetDueDate,
          priority: t.priority
        }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)

      upcomingDeadlines.value = [...upcomingDeadlines.value, ...upcoming]
    }

    if (corpTaxRes.success) {
      const tasks = corpTaxRes.corporationTaxes || []
      const pending = tasks.filter(t => !t.completed)
      const completed = tasks.filter(t => t.completed)

      stats.value.pendingTasks += pending.length
      stats.value.completedTasks += completed.length

      const paidTasks = tasks.filter(t => t.paid && t.payment)
      stats.value.totalRevenue += paidTasks.reduce((sum, t) => sum + (parseFloat(t.payment) || 0), 0)

      const upcoming = tasks
        .filter(t => !t.completed && t.dueDate)
        .map(t => ({
          type: 'Corporate Tax',
          description: t.taskDescription,
          corpId: t.corpId,
          dueDate: t.dueDate,
          priority: t.priority
        }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)

      upcomingDeadlines.value = [...upcomingDeadlines.value, ...upcoming].slice(0, 5)
    }

    upcomingDeadlines.value.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDaysUntil = (date) => {
  const today = new Date()
  const target = new Date(date)
  const diffTime = target - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return `${diffDays} days`
}

const getPriorityColor = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p.includes('high') || p.includes('urgent')) return 'text-red-600 bg-red-50 border-red-200'
  if (p.includes('medium')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-green-600 bg-green-50 border-green-200'
}

onMounted(fetchDashboardData)
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back{{ loginUser?.name ? ', ' + loginUser.name : '' }}</h1>
        <p class="mt-2 text-gray-600">Here's what's happening with your tax practice today</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                  <dd class="text-2xl font-bold text-gray-900">{{ stats.totalClients }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                  <dd class="text-2xl font-bold text-gray-900">{{ stats.completedTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                  <dd class="text-2xl font-bold text-gray-900">{{ stats.pendingTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Recent Clients -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Clients</h3>
          </div>
          <div class="p-6">
            <div v-if="recentClients.length === 0" class="text-center py-8 text-gray-500">
              No clients yet
            </div>
            <div v-else class="space-y-4">
              <NuxtLink
                v-for="client in recentClients"
                :key="client._id"
                :to="`/dashboard/clients/${client._id}`"
                class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span class="text-sm font-medium text-white">{{ client.name.charAt(0) }}</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900 group-hover:text-blue-700">{{ client.name }}</p>
                  <p class="text-xs text-gray-500">{{ client.email || 'No email' }}</p>
                </div>
                <div class="flex-shrink-0">
                  <span :class="client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ client.status }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
          </div>
          <div class="p-6">
            <div v-if="upcomingDeadlines.length === 0" class="text-center py-8 text-gray-500">
              No upcoming deadlines
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(deadline, idx) in upcomingDeadlines"
                :key="idx"
                class="p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs font-medium text-gray-500">{{ deadline.type }}</span>
                  <span class="text-xs font-semibold text-gray-900">{{ getDaysUntil(deadline.dueDate) }}</span>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ deadline.description || 'Untitled Task' }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ formatDate(deadline.dueDate) }}</span>
                  <span v-if="deadline.priority" :class="getPriorityColor(deadline.priority)" class="text-xs px-2 py-0.5 rounded border font-medium">
                    {{ deadline.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-if="isAdmin"
            to="/dashboard/employees"
            class="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-white">Employees</h4>
                <p class="text-sm text-blue-100">{{ stats.employees }} team members</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/clients"
            class="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-white">Clients</h4>
                <p class="text-sm text-green-100">{{ stats.totalClients }} clients</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/corporations"
            class="group relative bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-white">Corporations</h4>
                <p class="text-sm text-slate-100">{{ stats.totalCorporations }} corporations</p>
              </div>
            </div>
          </NuxtLink>

          <button
            @click="fetchDashboardData"
            class="group relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-white">Refresh</h4>
                <p class="text-sm text-teal-100">Update dashboard</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
