<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUser } from '~/composables/useUser'
import { apiGet } from '~/utils/api'
import DashboardWelcome from '~/components/dashboard/DashboardWelcome.vue'
import DashboardStats from '~/components/dashboard/DashboardStats.vue'
import RecentClients from '~/components/dashboard/RecentClients.vue'
import UpcomingDeadlines from '~/components/dashboard/UpcomingDeadlines.vue'
import QuickActions from '~/components/dashboard/QuickActions.vue'

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
    const res = await apiGet('/api/dashboard')

    if (res.success) {
      stats.value = res.stats
      recentClients.value = res.recentClients
      upcomingDeadlines.value = res.upcomingDeadlines
    } else {
      console.error('Failed to fetch dashboard data:', res.error)
    }
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  } finally {
    loading.value = false
  }
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
      <DashboardWelcome :user-name="loginUser?.name" />

      <!-- Stats Grid -->
      <DashboardStats :stats="stats" />

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Recent Clients -->
        <RecentClients :recent-clients="recentClients" />

        <!-- Upcoming Deadlines -->
        <UpcomingDeadlines :upcoming-deadlines="upcomingDeadlines" />
      </div>

      <!-- Quick Actions -->
      <QuickActions :is-admin="isAdmin" :stats="stats" @refresh="fetchDashboardData" />
    </template>
  </div>
</template>
