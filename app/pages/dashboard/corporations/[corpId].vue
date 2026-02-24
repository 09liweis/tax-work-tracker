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

import CorporationHeader from '~/components/CorporationHeader.vue'
import CorporationQuickInfo from '~/components/CorporationQuickInfo.vue'
import CorporationCompanyInfo from '~/components/CorporationCompanyInfo.vue'
import CorporationContactInfo from '~/components/CorporationContactInfo.vue'
import CorporationAccountAccess from '~/components/CorporationAccountAccess.vue'
import CorporationNotes from '~/components/CorporationNotes.vue'
import { apiGet } from '~/utils/api'

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
    const res = await apiGet(`/api/corporations/${corpId}`)
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
    const res = await apiGet(`/api/corporationTax?corpId=${corpId}`)
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
    const res = await apiGet(`/api/corporationPayroll?corpId=${corpId}`)
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
      <CorporationHeader :corp="corporation" />
      <CorporationQuickInfo :corp="corporation" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <CorporationCompanyInfo :corp="corporation" />
        </div>
        <CorporationContactInfo :corp="corporation" />
      </div>

      <CorporationAccountAccess :corp="corporation" />
      <CorporationNotes :note="corporation.note" />

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