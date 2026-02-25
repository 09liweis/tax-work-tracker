<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUser } from '~/composables/useUser'
import { apiGet } from '~/utils/api'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Admin Panel - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Admin panel for system management and configuration.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const { loginUser } = useUser()

const users = ref([])
const loading = ref(true)
const error = ref('')

// Fetch admin dashboard data
const fetchAdminData = async () => {
  loading.value = true
  error.value = ''
  try {
    const usersRes = await apiGet('/api/users')

    if (usersRes.success) {
      users.value = usersRes.users
    } else {
      console.error('Failed to fetch users:', usersRes.error)
    }
  } catch (err) {
    error.value = err?.message || 'Failed to load admin data'
    console.error('Admin data fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Computed values for user breakdown
const userStats = computed(() => {
  const adminCount = users.value.filter(u => u.role === 'admin').length
  const regularCount = users.value.filter(u => u.role === 'user').length
  const activeCount = users.value.filter(u => u.status === 'Active').length
  const inactiveCount = users.value.filter(u => u.status !== 'Active').length

  return {
    admin: adminCount,
    regular: regularCount,
    active: activeCount,
    inactive: inactiveCount
  }
})

onMounted(fetchAdminData)
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
      <p class="mt-1 text-sm text-gray-500">System administration and configuration</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mb-6">
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading admin data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Content -->
    <div v-else class="space-y-6">
      <!-- System Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ users.length }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Users -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Admin Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ userStats.admin }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Status Breakdown -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">User Status Breakdown</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Overview of user roles and account status</p>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-indigo-50 rounded-lg">
              <div class="text-3xl font-bold text-indigo-600">{{ userStats.regular }}</div>
              <div class="text-sm text-gray-600 mt-1">Regular Users</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-3xl font-bold text-purple-600">{{ userStats.admin }}</div>
              <div class="text-sm text-gray-600 mt-1">Admin Users</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ userStats.active }}</div>
              <div class="text-sm text-gray-600 mt-1">Active</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-3xl font-bold text-red-600">{{ userStats.inactive }}</div>
              <div class="text-sm text-gray-600 mt-1">Inactive</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Common administrative tasks</p>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink to="/dashboard/admin/employees" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Manage Employees</h4>
                <p class="text-sm text-gray-500">Add, edit, or remove team members</p>
              </div>
            </NuxtLink>
            <NuxtLink to="/dashboard/admin/personal-tax-services" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex-shrink-0 bg-green-100 rounded-md p-2">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Personal Tax Services</h4>
                <p class="text-sm text-gray-500">Manage personal tax services and pricing</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Current Admin Info -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Current Session</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Information about the currently logged in admin</p>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Admin Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ loginUser?.name || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Admin Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ loginUser?.email || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Role</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Admin
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Account Status</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ loginUser?.status || 'Active' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
