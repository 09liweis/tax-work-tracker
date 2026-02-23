<script setup>
import { watch, computed, ref, reactive } from 'vue'
import BaseInput from '~/components/form/BaseInput.vue'
import BaseTextarea from '~/components/form/BaseTextarea.vue'
import BaseCheckbox from '~/components/form/BaseCheckbox.vue'

const props = defineProps({
  visible: Boolean,
  clientId: {
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
  clientId: props.clientId,
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

function normalizeDate(d) {
  return d ? new Date(d).toISOString().substr(0,10) : ''
}

const resetForm = () => {
  Object.assign(form, {
    clientId: props.clientId,
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

const editTask = (task) => {
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <BaseInput v-model="form.taskDescription" label="Task Description" />
            </div>
            <div>
              <BaseInput v-model="form.taxYear" label="Tax Year" type="number" />
            </div>
            <div>
              <BaseInput v-model="form.caseWorker" label="Case Worker" />
            </div>
            <div>
              <BaseInput v-model="form.startDate" label="Start Date" type="date" />
            </div>
            <div>
              <BaseInput v-model="form.documentsFrom" label="Documents From" />
            </div>
            <div>
              <BaseInput v-model="form.targetDueDate" label="Target Due Date" type="date" />
            </div>
            <div>
              <BaseInput v-model="form.actualCompletedDate" label="Actual Completed Date" type="date" />
            </div>
            <div>
              <BaseInput v-model="form.status" label="Status" />
            </div>
            <div>
              <BaseInput v-model="form.blocker" label="Blocker / Waiting For" />
            </div>
            <div>
              <BaseInput v-model="form.priority" label="Priority" />
            </div>
            <div>
              <BaseInput v-model="form.receivable" label="Receivable" type="number" step="0.01" />
            </div>
            <BaseCheckbox v-model="form.invoice" id="invoice" label="Invoice (Yes/No)" />
            <BaseCheckbox v-model="form.paid" id="paid" label="Paid (Yes/No)" />
            <div>
              <BaseInput v-model="form.payment" label="Payment" type="number" step="0.01" />
            </div>
            <div class="md:col-span-2">
              <BaseTextarea v-model="form.notes" label="Notes" />
            </div>
            <BaseCheckbox v-model="form.completed" id="completed" label="Completed" />
          </div>
          <div class="mt-4">
            <button @click="saveTask" :disabled="formSaving" class="px-4 py-2 bg-green-600 text-white rounded">
              {{ formSaving ? 'Saving...' : 'Save Task' }}
            </button>
            <button @click="$emit('close')" type="button" class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>