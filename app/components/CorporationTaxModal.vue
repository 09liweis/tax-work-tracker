<script setup>
import { watch, computed, ref, reactive, onMounted } from 'vue'
import BaseInput from '~/components/form/BaseInput.vue'
import BaseTextarea from '~/components/form/BaseTextarea.vue'
import BaseCheckbox from '~/components/form/BaseCheckbox.vue'
import BaseSelect from '~/components/form/BaseSelect.vue'
import { STATUS_OPTIONS, PRIORITY_OPTIONS, DOC_STATUS_OPTIONS } from './utils/formOptions.js'

const DEPARTMENT_OPTIONS = [
  { label: 'PMS', value: 'PMS' },
  { label: 'PFS', value: 'PFS' }
]
import { apiGet } from '~/utils/api'

const props = defineProps({
  visible: Boolean,
  corpId: {
    type: [String, Number],
    required: true
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["close", "saved"])

const selectedTask = computed(() => props.task)

const form = reactive({
  corpId: props.corpId,
  taskType: '',
  category: '',
  yearEnding: '',
  taskDescription: '',
  caseWorkerId: '',
  supervisorId: '',
  docsReceivedDate: '',
  channel: '',
  hstDocStatus: '',
  t2DocStatus: '',
  missingItems: '',
  startDate: '',
  dueDate: '',
  actualCompletedDate: '',
  status: '',
  blockerWaitingFor: '',
  priority: '',
  receivableAmount: '',
  invoice: false,
  paid: false,
  payment: '',
  notes: '',
  completed: false,
})
const step = ref(1)
const maxStep = 3
const formError = ref('')
const formSaving = ref(false)

// Single loading state for users
const loadingUsers = ref(false)

// Supervisors for supervisorId dropdown
const supervisors = ref([])

// Employees for caseWorker dropdown
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

// navigation helpers for the multi-step wizard
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
    taskType: '',
    category: '',
    yearEnding: '',
    taskDescription: '',
    caseWorkerId: '',
    supervisorId: '',
    docsReceivedDate: '',
    channel: '',
    hstDocStatus: '',
    t2DocStatus: '',
    missingItems: '',
    startDate: '',
    dueDate: '',
    actualCompletedDate: '',
    status: '',
    blockerWaitingFor: '',
    priority: '',
    receivableAmount: '',
    invoice: false,
    paid: false,
    payment: '',
    notes: '',
    completed: false,
  })
  formError.value = ''
  step.value = 1
}

const editTask = (t) => {
  Object.assign(form, {
    ...t,
    yearEnding: t.yearEnding || '',
    receivableAmount: t.receivableAmount || '',
    payment: t.payment || '',
    docsReceivedDate: normalizeDate(t.docsReceivedDate),
    startDate: normalizeDate(t.startDate),
    dueDate: normalizeDate(t.dueDate),
    actualCompletedDate: normalizeDate(t.actualCompletedDate),
  })
  step.value = 1
}

watch(
  () => props.task,
  (t) => {
    if (t) {
      editTask(t)
    } else {
      resetForm()
    }
  }
)

watch(
  () => props.visible,
  (v) => {
    if (!v) {
      resetForm()
    }
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

// Fetch employees for caseWorker dropdown
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

const saveTask = async () => {
  // if not on last step, advance instead of sending
  if (step.value < maxStep) {
    step.value++
    return
  }

  formSaving.value = true
  formError.value = ''
  try {
    const token = localStorage.getItem('token')
    const payload = { ...form }
    if (selectedTask.value) payload.id = selectedTask.value._id || selectedTask.value.id
    const res = await $fetch('/api/corporationTax/upsert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
    if (!res.success) throw new Error(res.error || 'Failed to save task')
    emit('saved')
  } catch (err) {
    formError.value = err?.message || 'An error occurred while saving task'
  } finally {
    formSaving.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white" id="modal-title">
              {{ selectedTask ? 'Edit Task' : 'New Task' }}
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
                        {{ stepNum === 1 ? 'General' : stepNum === 2 ? 'Dates' : 'Status/Finance' }}
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
            <div v-if="step === 1" class="space-y-4">
              <h4 class="text-md font-semibold text-gray-800 mb-2">General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <BaseSelect v-model="form.taskType" label="Department" :options="DEPARTMENT_OPTIONS">
                    <option value="">-- Select Department --</option>
                  </BaseSelect>
                </div>
                <div>
                  <BaseInput v-model="form.category" label="Category" placeholder="PFS, Other" />
                </div>
                <div>
                  <BaseInput v-model="form.yearEnding" label="Year Ending" placeholder="2023" />
                </div>
                <div class="md:col-span-2">
                  <BaseInput v-model="form.taskDescription" label="Task Description" placeholder="e.g. Prepare corporate tax return" />
                </div>
                <div>
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
                <div>
                  <BaseInput v-model="form.channel" label="Channel" placeholder="Email/Phone" />
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
              </div>

              <div class="mt-4">
                <BaseTextarea v-model="form.missingItems" label="Missing Items" placeholder="List missing documents" />
              </div>
            </div>

            <!-- dates -->
            <div v-if="step === 2" class="space-y-4">
              <h4 class="text-md font-semibold text-gray-800 mt-6 mb-2">Dates</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <BaseInput v-model="form.docsReceivedDate" label="Docs Received" type="date" />
                </div>
                <div>
                  <BaseInput v-model="form.startDate" label="Start Date" type="date" />
                </div>
                <div>
                  <BaseInput v-model="form.dueDate" label="Due Date" type="date" />
                </div>
                <div>
                  <BaseInput v-model="form.actualCompletedDate" label="Completed Date" type="date" />
                </div>
              </div>
            </div>

            <!-- status & financial -->
            <div v-if="step === 3" class="space-y-4">
              <h4 class="text-md font-semibold text-gray-800 mt-6 mb-2">Status / Finance</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <BaseSelect v-model="form.status" label="Status" :options="STATUS_OPTIONS" />
                </div>
                <div>
                  <BaseSelect v-model="form.priority" label="Priority" :options="PRIORITY_OPTIONS" />
                </div>
                <div>
                  <BaseInput v-model="form.blockerWaitingFor" label="Blocker / Waiting For" />
                </div>
                <div>
                  <BaseSelect v-model="form.hstDocStatus" label="HST Doc Status" :options="DOC_STATUS_OPTIONS" />
                </div>
                <div>
                  <BaseSelect v-model="form.t2DocStatus" label="T2 Doc Status" :options="DOC_STATUS_OPTIONS" />
                </div>
                <BaseCheckbox v-model="form.completed" id="completed" label="Completed" />
              </div>

              <!-- finance details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <BaseInput v-model="form.receivableAmount" label="Receivable Amount" type="number" step="0.01" />
                </div>
                <BaseCheckbox v-model="form.invoice" id="invoice" label="Invoice" />
                <BaseCheckbox v-model="form.paid" id="paid" label="Paid" />
                <div>
                  <BaseInput v-model="form.payment" label="Payment Amount" type="number" step="0.01" />
                </div>
              </div>

              <div class="mt-4">
                <BaseTextarea v-model="form.notes" label="Notes" />
              </div>
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
              @click="saveTask"
              :disabled="formSaving"
              class="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
            >
              {{ selectedTask ? 'Update Task' : 'Add Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
