<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Corporation Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a corporate client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

import CorporationTaxSection from '~/components/CorporationTaxSection.vue'
import CorporationTaxModal from '~/components/CorporationTaxModal.vue'
import CorporationPayrollSection from '~/components/CorporationPayrollSection.vue'
import CorporationPayrollModal from '~/components/CorporationPayrollModal.vue'

const route = useRoute()
const corpId = route.params.corpId

// state for corporation record fetched from API
const corporation = ref(null)
const loading = ref(true)
const fetchError = ref('')

// corporation tax tasks
const corpTaxes = ref([])
const corpTaxesLoading = ref(false)
const corpTaxesError = ref('')

// modal state for tax tasks
const showTaxModal = ref(false)
const modalTax = ref(null)
const taxEditing = ref(false)

// payroll records
const corpPayrolls = ref([])
const corpPayrollsLoading = ref(false)
const corpPayrollsError = ref('')

// modal state for payroll
const showPayrollModal = ref(false)
const modalPayroll = ref(null)
const payrollEditing = ref(false)

const fetchCorporation = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/corporations/${corpId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load corporation')
    corporation.value = { ...res.corporation, id: res.corporation._id || res.corporation.id }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading corporation'
  } finally {
    loading.value = false
  }
}

const fetchTaxes = async () => {
  corpTaxesLoading.value = true
  corpTaxesError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/corporationTax?corpId=${corpId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load tax tasks')
    corpTaxes.value = (res.corporationTaxes || []).map(t => ({ ...t, id: t._id || t.id }))
  } catch (err) {
    corpTaxesError.value = err?.message || 'An error occurred while loading tax tasks'
  } finally {
    corpTaxesLoading.value = false
  }
}

const fetchPayrolls = async () => {
  corpPayrollsLoading.value = true
  corpPayrollsError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/corporationPayroll?corpId=${corpId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load payroll records')
    corpPayrolls.value = (res.corporationPayrolls || []).map(r => ({ ...r, id: r._id || r.id }))
  } catch (err) {
    corpPayrollsError.value = err?.message || 'An error occurred while loading payroll records'
  } finally {
    corpPayrollsLoading.value = false
  }
}

// tax task modal handlers
const openAddTaxModal = () => {
  taxEditing.value = false
  modalTax.value = null
  showTaxModal.value = true
}
const openEditTaxModal = (t) => {
  taxEditing.value = true
  modalTax.value = { ...t }
  showTaxModal.value = true
}
const closeTaxModal = () => {
  showTaxModal.value = false
  modalTax.value = null
}
const handleTaxSave = async () => {
  await fetchTaxes()
  closeTaxModal()
}

// payroll modal handlers
const openAddPayrollModal = () => {
  payrollEditing.value = false
  modalPayroll.value = null
  showPayrollModal.value = true
}
const openEditPayrollModal = (r) => {
  payrollEditing.value = true
  modalPayroll.value = { ...r }
  showPayrollModal.value = true
}
const closePayrollModal = () => {
  showPayrollModal.value = false
  modalPayroll.value = null
}
const handlePayrollSave = async () => {
  await fetchPayrolls()
  closePayrollModal()
}

onMounted(async () => {
  await fetchCorporation()
  if (!corporation.value) {
    throw createError({ statusCode: 404, statusMessage: 'Corporation not found' })
  }
  await fetchTaxes()
  await fetchPayrolls()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-gray-600 font-medium">Loading corporation details</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="max-w-7xl mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-800 font-medium">{{ fetchError }}</p>
      </div>
    </div>

    <!-- Corporation Details -->
    <div v-else-if="corporation" class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-8">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-20 w-20 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span class="text-3xl font-bold text-white">{{ corporation.name.charAt(0) }}</span>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white mb-1">{{ corporation.name }}</h1>
                <p class="text-slate-300 text-sm">{{ corporation.industry || 'Corporate Client' }}</p>
              </div>
            </div>
            <div>
              <span
                :class="{
                  'bg-green-100 text-green-700 border-green-200': corporation.status === 'Active',
                  'bg-yellow-100 text-yellow-700 border-yellow-200': corporation.status === 'Under Review',
                  'bg-gray-100 text-gray-700 border-gray-200': corporation.status === 'Inactive'
                }"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border"
              >
                <span class="w-2 h-2 rounded-full mr-2" :class="{
                  'bg-green-500': corporation.status === 'Active',
                  'bg-yellow-500': corporation.status === 'Under Review',
                  'bg-gray-500': corporation.status === 'Inactive'
                }"></span>
                {{ corporation.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          <div class="bg-white px-6 py-4">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">BN Number</div>
            <div class="text-sm font-medium text-gray-900">{{ corporation.bnNumber || '—' }}</div>
          </div>
          <div class="bg-white px-6 py-4">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Federal No.</div>
            <div class="text-sm font-medium text-gray-900">{{ corporation.federalNo || '—' }}</div>
          </div>
          <div class="bg-white px-6 py-4">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Provincial No.</div>
            <div class="text-sm font-medium text-gray-900">{{ corporation.provincialNo || '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Company Information -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Company Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Incorporated Date</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.incorporatedDate ? new Date(corporation.incorporatedDate).toLocaleDateString() : '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year End</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.endingPeriod ? new Date(corporation.endingPeriod).toLocaleDateString() : '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">WSIB No.</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.wsibNo || '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Code</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.accessCode || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contact Details
          </h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Primary Contact</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.primaryContact || '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Phone</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.mainPhone || '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <p class="mt-1 text-sm text-gray-900 break-words">{{ corporation.mainEmail || '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
              <p class="mt-1 text-sm text-gray-900">{{ corporation.address || '—' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Access -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Account Access Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">ISED Account ID</label>
            <p class="mt-1 text-sm text-gray-900 font-mono">{{ corporation.isedAccountId || '—' }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Federal Key</label>
            <p class="mt-1 text-sm text-gray-900 font-mono">{{ corporation.federalKey || '—' }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Key</label>
            <p class="mt-1 text-sm text-gray-900 font-mono">{{ corporation.companyKey || '—' }}</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">ONE KEY ID</label>
            <p class="mt-1 text-sm text-gray-900 font-mono">{{ corporation.oneKeyId || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div v-if="corporation.note" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 class="text-sm font-semibold text-amber-900 mb-2 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          Notes
        </h2>
        <p class="text-sm text-gray-700">{{ corporation.note }}</p>
      </div>

      <!-- Corporate Tax Tasks -->
      <CorporationTaxSection
        :tasks="corpTaxes"
        :loading="corpTaxesLoading"
        :error="corpTaxesError"
        @new="openAddTaxModal"
        @edit="openEditTaxModal"
      />

      <CorporationTaxModal
        :visible="showTaxModal"
        :corpId="corpId"
        :task="modalTax"
        @close="closeTaxModal"
        @saved="handleTaxSave"
      />

      <!-- Payroll Records -->
      <CorporationPayrollSection
        :tasks="corpPayrolls"
        :loading="corpPayrollsLoading"
        :error="corpPayrollsError"
        @new="openAddPayrollModal"
        @edit="openEditPayrollModal"
      />

      <CorporationPayrollModal
        :visible="showPayrollModal"
        :corpId="corpId"
        :record="modalPayroll"
        @close="closePayrollModal"
        @saved="handlePayrollSave"
      />
    </div>
  </div>
</template>