<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Client Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a tax client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const clientId = route.params.clientId

const client = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// personal tax management
const personalTaxes = ref([])
const personalTaxesLoading = ref(false)
const personalTaxesError = ref('')

const selectedTask = ref(null)
const showTaskModal = ref(false)

const form = reactive({
  clientId,
  taskDescription: '',
  taxYear: '',
  caseWorker: '',
  startDate: '',
  documentsFrom: '',
  targetDueDate: '',
  actualCompletedDate: '',
  status: '',
  blocker: '',
  priority: '',
  receivable: '',
  invoice: false,
  paid: false,
  payment: '',
  notes: '',
  completed: false,
})
const formError = ref('')
const formSaving = ref(false)


const fetchClient = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load client')
    client.value = { ...res.client, id: res.client._id || res.client.id }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading client'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchClient()
  await fetchPersonalTaxes()
})

const fetchPersonalTaxes = async () => {
  personalTaxesLoading.value = true
  personalTaxesError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/personalTax?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load personal tax records')
    personalTaxes.value = res.personalTaxes || []
  } catch (err) {
    personalTaxesError.value = err?.message || 'An error occurred while loading personal taxes'
  } finally {
    personalTaxesLoading.value = false
  }
}

const resetForm = () => {
  selectedTask.value = null
  Object.assign(form, {
    clientId,
    taskDescription: '',
    taxYear: '',
    caseWorker: '',
    startDate: '',
    documentsFrom: '',
    targetDueDate: '',
    actualCompletedDate: '',
    status: '',
    blocker: '',
    priority: '',
    receivable: '',
    invoice: false,
    paid: false,
    payment: '',
    notes: '',
    completed: false,
  })
  formError.value = ''
}

const openModal = () => {
  resetForm()
  showTaskModal.value = true
}

const openEditModal = (task) => {
  editTask(task)
  showTaskModal.value = true
}

const closeModal = () => {
  showTaskModal.value = false
  resetForm()
}

const editTask = (task) => {
  selectedTask.value = task
  const normalizeDate = (d) => d ? new Date(d).toISOString().substr(0,10) : ''
  Object.assign(form, {
    ...task,
    taxYear: task.taxYear || '',
    receivable: task.receivable || '',
    payment: task.payment || '',
    startDate: normalizeDate(task.startDate),
    targetDueDate: normalizeDate(task.targetDueDate),
    actualCompletedDate: normalizeDate(task.actualCompletedDate),
  })
}

const saveTask = async () => {
  formSaving.value = true
  formError.value = ''
  try {
    const token = localStorage.getItem('token')
    const payload = { ...form }
    if (selectedTask.value) payload.id = selectedTask.value._id || selectedTask.value.id
    const res = await $fetch('/api/personalTax/upsert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
    if (!res.success) throw new Error(res.error || 'Failed to save task')
    await fetchPersonalTaxes()
    resetForm()
    closeModal()
  } catch (err) {
    formError.value = err?.message || 'An error occurred while saving task'
  } finally {
    formSaving.value = false
  }
}

</script>

<template>
  <div class="px-4 py-6 sm:px-0">

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-gray-500">
      <svg class="animate-spin h-10 w-10 mb-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Loading client details...
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError" class="rounded-md bg-red-50 p-6 flex items-center justify-between">
      <p class="text-sm text-red-700">{{ fetchError }}</p>
      <button @click="fetchClient" class="text-sm text-red-600 font-medium hover:text-red-500 underline ml-4">Retry</button>
    </div>

    <!-- Client content -->
    <template v-else-if="client">
      <!-- Client Info Card -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Client Information</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this client.</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.name }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ client.dob ? new Date(client.dob).toLocaleDateString() : '—' }}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">SIN</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.sin || '—' }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.email || '—' }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.telephone || '—' }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">City</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.city || '—' }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Province</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.province || '—' }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Marital Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.maritalStatus || '—' }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Gender</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.gender || '—' }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  :class="client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ client.status }}
                </span>
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ client.lts ? new Date(client.lts).toLocaleString() : '—' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Personal tax records section -->
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Records</h3>

        <!-- personal taxes loading / error -->
        <div v-if="personalTaxesLoading" class="flex items-center py-4 text-gray-500">
          <svg class="animate-spin h-6 w-6 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Loading tasks...
        </div>
        <div v-else-if="personalTaxesError" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {{ personalTaxesError }}
        </div>

        <!-- task list -->
        <div v-else>
          <button @click="openModal" class="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">New Record</button>
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-2 py-1 text-left">Description</th>
                <th class="border px-2 py-1">Year</th>
                <th class="border px-2 py-1">Status</th>
                <th class="border px-2 py-1">Priority</th>
                <th class="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in personalTaxes" :key="task._id">
                <td class="border px-2 py-1">{{ task.taskDescription }}</td>
                <td class="border px-2 py-1 text-center">{{ task.taxYear }}</td>
                <td class="border px-2 py-1 text-center">{{ task.status }}</td>
                <td class="border px-2 py-1 text-center">{{ task.priority }}</td>
                <td class="border px-2 py-1 text-center">
                  <button @click="openEditModal(task)" class="text-indigo-600 hover:underline">Edit</button>
                </td>
              </tr>
              <tr v-if="personalTaxes.length === 0">
                <td class="border px-2 py-2 text-center" colspan="5">No records found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- task modal -->
        <div v-if="showTaskModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="closeModal"></div>

            <!-- Modal panel -->
            <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white" id="modal-title">
                    {{ selectedTask ? 'Edit Task' : 'New Task' }}
                  </h3>
                  <button type="button" class="text-white text-2xl leading-none" @click="closeModal">&times;</button>
                </div>
              </div>

              <div class="px-6 py-6">
                <div v-if="formError" class="mb-4 text-sm text-red-600">{{ formError }}</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Task Description</label>
                    <input v-model="form.taskDescription" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Tax Year</label>
                    <input v-model="form.taxYear" type="number" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Case Worker</label>
                    <input v-model="form.caseWorker" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input v-model="form.startDate" type="date" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Documents From</label>
                    <input v-model="form.documentsFrom" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Target Due Date</label>
                    <input v-model="form.targetDueDate" type="date" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Actual Completed Date</label>
                    <input v-model="form.actualCompletedDate" type="date" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <input v-model="form.status" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Blocker / Waiting For</label>
                    <input v-model="form.blocker" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Priority</label>
                    <input v-model="form.priority" type="text" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Receivable</label>
                    <input v-model="form.receivable" type="number" step="0.01" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div class="flex items-center space-x-2">
                    <input v-model="form.invoice" type="checkbox" id="invoice" class="h-4 w-4" />
                    <label for="invoice" class="text-sm font-medium text-gray-700">Invoice (Yes/No)</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input v-model="form.paid" type="checkbox" id="paid" class="h-4 w-4" />
                    <label for="paid" class="text-sm font-medium text-gray-700">Paid (Yes/No)</label>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Payment</label>
                    <input v-model="form.payment" type="number" step="0.01" class="mt-1 block w-full border rounded p-2" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea v-model="form.notes" class="mt-1 block w-full border rounded p-2"></textarea>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input v-model="form.completed" type="checkbox" id="completed" class="h-4 w-4" />
                    <label for="completed" class="text-sm font-medium text-gray-700">Completed</label>
                  </div>
                </div>
                <div class="mt-4">
                  <button @click="saveTask" :disabled="formSaving" class="px-4 py-2 bg-green-600 text-white rounded">
                    {{ formSaving ? 'Saving...' : 'Save Task' }}
                  </button>
                  <button @click="closeModal" type="button" class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>
    </template>
  </div>
</template>