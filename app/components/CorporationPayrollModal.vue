<script setup>
import { watch, computed, ref, reactive, onMounted } from 'vue'
import BaseInput from '~/components/form/BaseInput.vue'
import BaseTextarea from '~/components/form/BaseTextarea.vue'
import BaseCheckbox from '~/components/form/BaseCheckbox.vue'
import BaseSelect from '~/components/form/BaseSelect.vue'
import {
  PAYROLL_STATUS_OPTIONS,
  FREQUENCY_OPTIONS,
  TAX_SLIPS_STATUS_OPTIONS,
  SUBMIT_METHOD_OPTIONS,
  FILLING_METHOD_OPTIONS
} from './utils/formOptions.js'
import { apiGet } from '~/utils/api'

const props = defineProps({
  visible: Boolean,
  corpId: {
    type: [String, Number],
    required: true
  },
  record: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["close", "saved"])

const selectedRecord = computed(() => props.record)

const form = reactive({
  corpId: props.corpId,
  caseWorkerId: '',
  supervisorId: '',
  year: '',
  payrollFrequency: '',
  remittanceFrequency: '',
  authStatus: false,
  webAccessCode: '',
  bnNumber: '',
  wsib: false,
  payrollStatus: '',
  payrollNotes: '',
  nilRemiStatus: '',
  remittanceReconciliation: '',
  taxSlipsStatus: '',
  t4Gross: '',
  t4: '',
  t4aAmount: '',
  t4a: '',
  t5NetBox11: '',
  t5: '',
  taxSlipsNote: '',
  submitMethod: '',
  fillingMethod: '',
  submittedDate: '',
  notes: ''
})

const formError = ref('')
const formSaving = ref(false)
const step = ref(1)
const maxStep = 3

// Single loading state for users
const loadingUsers = ref(false)

// Supervisors for supervisorId dropdown
const supervisors = ref([])

// Employees for caseWorkerId dropdown
const employees = ref([])

// Fetch users once and populate both supervisors and employees arrays
const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    const res = await apiGet('/api/users')
    if (res.success && res.users) {
      // Filter and map employees (case workers)
      employees.value = res.users
        .filter(u => u.role === 'user' || u.role === 'employee')
        .map(u => ({
          label: u.name || u.email,
          value: u._id || u.id
        }))
      // Filter and map supervisors (admins)
      supervisors.value = res.users
        .filter(u => u.role === 'admin')
        .map(u => ({
          label: u.name || u.email,
          value: u._id || u.id
        }))
    }
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loadingUsers.value = false
  }
}

// navigation helpers
function nextStep() {
  if (step.value < maxStep) {
    step.value++
  }
}
function prevStep() {
  if (step.value > 1) {
    step.value--
  }
}

function normalizeDate(d) {
  return d ? new Date(d).toISOString().substr(0,10) : ''
}

const resetForm = () => {
  Object.assign(form, {
    corpId: props.corpId,
    caseWorkerId: '',
    supervisorId: '',
    year: '',
    payrollFrequency: '',
    remittanceFrequency: '',
    authStatus: false,
    webAccessCode: '',
    bnNumber: '',
    wsib: false,
    payrollStatus: '',
    payrollNotes: '',
    nilRemiStatus: '',
    remittanceReconciliation: '',
    taxSlipsStatus: '',
    t4Gross: '',
    t4: '',
    t4aAmount: '',
    t4a: '',
    t5NetBox11: '',
    t5: '',
    taxSlipsNote: '',
    submitMethod: '',
    fillingMethod: '',
    submittedDate: '',
    notes: ''
  })
  formError.value = ''
  step.value = 1
}

const editRecord = (r) => {
  Object.assign(form, {
    ...r,
    submittedDate: normalizeDate(r.submittedDate)
  })
  step.value = 1
}

watch(
  () => props.record,
  (r) => {
    if (r) {
      editRecord(r)
    } else {
      resetForm()
    }
  }
)

watch(
  () => props.visible,
  (v) => {
    if (!v) resetForm()
  }
)

// Fetch supervisors for supervisorId dropdown
const fetchSupervisors = async () => {
  loadingSupervisors.value = true
  try {
    const res = await apiGet('/api/users')
    if (res.success && res.users) {
      supervisors.value = res.users
        .filter(u => u.role === 'admin')
        .map(u => ({
          label: u.name || u.email,
          value: u._id || u.id
        }))
    }
  } catch (err) {
    console.error('Failed to fetch supervisors:', err)
  } finally {
    loadingSupervisors.value = false
  }
}

// Fetch employees for caseWorkerId dropdown
const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    const res = await apiGet('/api/users')
    if (res.success && res.users) {
      employees.value = res.users
        .filter(u => u.role === 'user' || u.role === 'employee')
        .map(u => ({
          label: u.name || u.email,
          value: u._id || u.id
        }))
    }
  } catch (err) {
    console.error('Failed to fetch employees:', err)
  } finally {
    loadingEmployees.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const saveRecord = async () => {
  // if not last step, move forward instead of submitting
  if (step.value < maxStep) {
    step.value++
    return
  }

  formSaving.value = true
  formError.value = ''
  try {
    const token = localStorage.getItem('token')
    const payload = { ...form }
    if (selectedRecord.value) payload.id = selectedRecord.value._id || selectedRecord.value.id
    const res = await $fetch('/api/corporationPayroll/upsert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
    if (!res.success) throw new Error(res.error || 'Failed to save record')
    emit('saved')
  } catch (err) {
    formError.value = err?.message || 'An error occurred while saving record'
  } finally {
    formSaving.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white" id="modal-title">
              {{ selectedRecord ? 'Edit Payroll' : 'New Payroll' }}
            </h3>
            <button type="button" class="text-white text-2xl leading-none" @click="$emit('close')">&times;</button>
          </div>
        </div>
        <div class="px-6 py-6">
          <div v-if="formError" class="mb-4 text-sm text-red-600">{{ formError }}</div>
          <!-- step indicator -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div v-for="stepNum in maxStep" :key="stepNum" class="flex items-center flex-1">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                      step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    ]"
                  >
                    {{ stepNum }}
                  </div>
                  <div class="ml-2 hidden sm:block">
                    <div
                      :class="[
                        'text-xs font-medium',
                        step >= stepNum ? 'text-blue-600' : 'text-gray-500'
                      ]"
                    >
                      {{ stepNum === 1 ? 'General' : stepNum === 2 ? 'Remittance/Slips' : 'Submission' }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="stepNum < maxStep"
                  :class="[
                    'flex-1 h-0.5 mx-2 transition-all duration-200',
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                  ]"
                ></div>
              </div>
            </div>
          </div>

          <!-- general info -->
          <div v-if="step === 1" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <BaseInput v-model="form.year" label="Year" />
            </div>
            <div>
              <BaseSelect v-model="form.payrollFrequency" label="Payroll Frequency" :options="FREQUENCY_OPTIONS" />
            </div>
            <div>
              <BaseSelect v-model="form.remittanceFrequency" label="Remittance Frequency" :options="FREQUENCY_OPTIONS" />
            </div>
            <BaseCheckbox v-model="form.authStatus" id="authStatus" label="Auth Status" />
            <div>
              <BaseInput v-model="form.webAccessCode" label="Web Access Code" />
            </div>
            <div>
              <BaseInput v-model="form.bnNumber" label="BN Number" />
            </div>
            <BaseCheckbox v-model="form.wsib" id="wsib" label="WSIB" />
            <div>
              <BaseSelect v-model="form.payrollStatus" label="Payroll Status" :options="PAYROLL_STATUS_OPTIONS" />
            </div>
            <div class="md:col-span-2">
              <BaseSelect
                v-model="form.caseWorkerId"
                label="Case Worker"
                :options="employees"
                :disabled="loadingUsers"
              >
                <option value="">-- Select an employee --</option>
              </BaseSelect>
              <span v-if="loadingUsers" class="text-xs text-gray-500 mt-1">Loading employees...</span>
            </div>
            <div class="md:col-span-2">
              <BaseSelect
                v-model="form.supervisorId"
                label="Supervisor"
                :options="supervisors"
                :disabled="loadingUsers"
              >
                <option value="">-- Select a supervisor --</option>
              </BaseSelect>
              <span v-if="loadingUsers" class="text-xs text-gray-500 mt-1">Loading supervisors...</span>
            </div>
            <div class="md:col-span-2">
              <BaseTextarea v-model="form.payrollNotes" label="Payroll Notes" />
            </div>
          </div>

          <!-- remittance / slips -->
          <div v-if="step === 2" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <BaseInput v-model="form.nilRemiStatus" label="Nil Remi Status" />
            </div>
            <div>
              <BaseInput v-model="form.remittanceReconciliation" label="Remittance Reconciliation" />
            </div>
            <div>
              <BaseSelect v-model="form.taxSlipsStatus" label="Tax Slips Status" :options="TAX_SLIPS_STATUS_OPTIONS" />
            </div>
            <div>
              <BaseInput v-model="form.t4Gross" label="T4 Gross" type="number" step="0.01" />
            </div>
            <div>
              <BaseInput v-model="form.t4" label="T4" type="number" step="0.01" />
            </div>
            <div>
              <BaseInput v-model="form.t4aAmount" label="T4A Amount" type="number" step="0.01" />
            </div>
            <div>
              <BaseInput v-model="form.t4a" label="T4A" type="number" step="0.01" />
            </div>
            <div>
              <BaseInput v-model="form.t5NetBox11" label="T5 Net (BOX 11)" type="number" step="0.01" />
            </div>
            <div>
              <BaseInput v-model="form.t5" label="T5" type="number" step="0.01" />
            </div>
            <div class="md:col-span-2">
              <BaseTextarea v-model="form.taxSlipsNote" label="Tax Slips Note" />
            </div>
          </div>

          <!-- submission -->
          <div v-if="step === 3" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <BaseSelect v-model="form.submitMethod" label="Submit Method" :options="SUBMIT_METHOD_OPTIONS" />
            </div>
            <div>
              <BaseSelect v-model="form.fillingMethod" label="Filling Method" :options="FILLING_METHOD_OPTIONS" />
            </div>
            <div>
              <BaseInput v-model="form.submittedDate" label="Submitted Date" type="date" />
            </div>
            <div class="md:col-span-2">
              <BaseTextarea v-model="form.notes" label="Notes" />
            </div>
          </div>

          <!-- navigation buttons -->
          <div class="mt-6 flex justify-between">
            <button
              type="button"
              @click="prevStep"
              :disabled="step === 1"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Previous
            </button>
            <div>
              <button
                v-if="step < maxStep"
                type="button"
                @click="nextStep"
                class="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
              <button
                v-else
                type="button"
                @click="saveRecord"
                :disabled="formSaving"
                class="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
              >
                {{ selectedRecord ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
