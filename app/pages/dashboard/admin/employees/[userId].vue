<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Employee Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about an employee.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

import { apiGet } from '~/utils/api'

const route = useRoute()
const userId = route.params.userId

const userData = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// Tab state
const activeTab = ref('overview')

// Date range filter
const startDate = ref('')
const endDate = ref('')

const fetchUserData = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    let url = `/api/users/${userId}`
    const params = new URLSearchParams()
    if (startDate.value) params.append('startDate', startDate.value)
    if (endDate.value) params.append('endDate', endDate.value)
    if (params.toString()) url += `?${params.toString()}`

    const res = await apiGet(url)
    if (!res.success) throw new Error(res.error || 'Failed to load employee data')
    userData.value = res
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading employee data'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchUserData()
})

const clearDateFilter = () => {
  startDate.value = ''
  endDate.value = ''
  fetchUserData()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          to="/dashboard/admin/employees"
          class="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Employees
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">Employee Details</h1>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded p-6 mb-6">
        <p class="text-red-800">{{ fetchError }}</p>
      </div>

      <!-- Content -->
      <div v-else-if="userData" class="space-y-6">
        <!-- Date Range Filter -->
        <EmployeeDateFilter
          v-model:start-date="startDate"
          v-model:end-date="endDate"
          @apply="fetchUserData"
          @clear="clearDateFilter"
        />

        <!-- Employee Info Card -->
        <EmployeeInfoCard
          :user="userData.user"
          :total-payment="userData.totalPayment"
        />

        <!-- Stats Cards -->
        <EmployeeStats :stats="userData.stats" />

        <!-- Tab Navigation -->
        <div class="bg-white shadow rounded">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                @click="activeTab = 'overview'"
                :class="[
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Overview
              </button>
              <button
                @click="activeTab = 'personalTax'"
                :class="[
                  activeTab === 'personalTax'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Personal Tax ({{ userData.stats.personalTaxCount }})
              </button>
              <button
                @click="activeTab = 'corporationTax'"
                :class="[
                  activeTab === 'corporationTax'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Corporation Tax ({{ userData.stats.corporationTaxCount }})
              </button>
              <button
                @click="activeTab = 'payroll'"
                :class="[
                  activeTab === 'payroll'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Payroll ({{ userData.stats.payrollCount }})
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Overview Tab -->
            <EmployeeOverview
              v-if="activeTab === 'overview'"
              :personal-taxes="userData.personalTaxes"
              :corporation-taxes="userData.corporationTaxes"
              :stats="userData.stats"
            />

            <!-- Personal Tax Tab -->
            <EmployeePersonalTaxTable
              v-if="activeTab === 'personalTax'"
              :personal-taxes="userData.personalTaxes"
            />

            <!-- Corporation Tax Tab -->
            <EmployeeCorporationTaxTable
              v-if="activeTab === 'corporationTax'"
              :corporation-taxes="userData.corporationTaxes"
            />

            <!-- Payroll Tab -->
            <EmployeePayrollTable
              v-if="activeTab === 'payroll'"
              :corporation-payrolls="userData.corporationPayrolls"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
