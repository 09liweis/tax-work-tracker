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
import { getStatusColor, getPriorityColor, getTaskTypeIcon } from '~/components/utils/statusHelpers'
import { formatDate } from '~/utils/dateFormat'

const route = useRoute()
const userId = route.params.userId

const userData = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// Tab state
const activeTab = ref('overview')

const fetchUserData = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await apiGet(`/api/users/${userId}`)
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

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount)
}

const calculatePersonalTaxTotal = () => {
  if (!userData.value?.personalTaxes) return 0
  return userData.value.personalTaxes.reduce((sum, tax) => sum + (tax.payment || 0), 0)
}

const calculateCorporationTaxTotal = () => {
  if (!userData.value?.corporationTaxes) return 0
  return userData.value.corporationTaxes.reduce((sum, tax) => sum + (tax.payment || 0), 0)
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
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p class="text-red-800">{{ fetchError }}</p>
      </div>

      <!-- Content -->
      <div v-else-if="userData" class="space-y-6">
        <!-- Employee Info Card -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 class="text-xl font-semibold text-white">{{ userData.user.name }}</h2>
            <p class="text-indigo-100">{{ userData.user.email }}</p>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Role</p>
                <p class="text-lg text-gray-900">{{ userData.user.role }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Status</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                  :class="userData.user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ userData.user.status }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Total Payment</p>
                <p class="text-lg font-bold text-indigo-600">{{ formatCurrency(userData.totalPayment) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500">Personal Tax Tasks</p>
                <p class="text-2xl font-semibold text-gray-900">{{ userData.stats.personalTaxCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500">Corporation Tax Tasks</p>
                <p class="text-2xl font-semibold text-gray-900">{{ userData.stats.corporationTaxCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500">Payroll Records</p>
                <p class="text-2xl font-semibold text-gray-900">{{ userData.stats.payrollCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white shadow rounded-lg">
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
            <div v-if="activeTab === 'overview'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">Personal Tax Payments</h3>
                  <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(calculatePersonalTaxTotal()) }}</p>
                  <p class="text-sm text-gray-500">{{ userData.stats.personalTaxCount }} records</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">Corporation Tax Payments</h3>
                  <p class="text-2xl font-bold text-green-600">{{ formatCurrency(calculateCorporationTaxTotal()) }}</p>
                  <p class="text-sm text-gray-500">{{ userData.stats.corporationTaxCount }} records</p>
                </div>
              </div>
            </div>

            <!-- Personal Tax Tab -->
            <div v-if="activeTab === 'personalTax'" class="space-y-4">
              <div v-if="userData.personalTaxes.length === 0" class="text-center py-8 text-gray-500">
                No personal tax records found
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Year</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="tax in userData.personalTaxes" :key="tax._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tax.taskDescription || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tax.taxYear || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(tax.status, 'tax')">
                          {{ tax.status || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getPriorityColor(tax.priority)">
                          {{ tax.priority || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ tax.targetDueDate ? formatDate(tax.targetDueDate) : '-' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="tax.payment ? 'text-green-600' : 'text-gray-400'">
                        {{ formatCurrency(tax.payment) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Corporation Tax Tab -->
            <div v-if="activeTab === 'corporationTax'" class="space-y-4">
              <div v-if="userData.corporationTaxes.length === 0" class="text-center py-8 text-gray-500">
                No corporation tax records found
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Ending</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="tax in userData.corporationTaxes" :key="tax._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="mr-2">{{ getTaskTypeIcon(tax.taskType) }}</span>
                        {{ tax.taskType || '-' }}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900">{{ tax.taskDescription || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tax.yearEnding || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(tax.status, 'tax')">
                          {{ tax.status || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getPriorityColor(tax.priority)">
                          {{ tax.priority || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ tax.dueDate ? formatDate(tax.dueDate) : '-' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="tax.payment ? 'text-green-600' : 'text-gray-400'">
                        {{ formatCurrency(tax.payment) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Payroll Tab -->
            <div v-if="activeTab === 'payroll'" class="space-y-4">
              <div v-if="userData.corporationPayrolls.length === 0" class="text-center py-8 text-gray-500">
                No payroll records found
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corporation ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payroll Frequency</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="payroll in userData.corporationPayrolls" :key="payroll._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payroll.corpId || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payroll.year || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700">
                          {{ payroll.payrollFrequency || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(payroll.payrollStatus, 'payroll')">
                          {{ payroll.payrollStatus || '-' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ payroll.submittedDate ? formatDate(payroll.submittedDate) : '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
