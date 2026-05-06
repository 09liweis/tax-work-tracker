<script setup>
const props = defineProps({
  personalTaxes: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: String,
  selectedYear: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(["new", "edit", "filter"])

const filterYear = ref(props.selectedYear || new Date().getFullYear().toString())

const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString())
  }
  return years
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-CA')
}

// Apply year filter
const applyFilter = () => {
  emit('filter', { year: filterYear.value })
}

// Clear filter
const clearFilter = () => {
  filterYear.value = ''
  emit('filter', { year: '' })
}
</script>

<template>
  <div class="p-4">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Records</h3>

    <!-- Year Filter -->
    <div class="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded">
      <label for="year-filter" class="text-sm font-medium text-gray-700">Filter by Year:</label>
      <select
        id="year-filter"
        v-model="filterYear"
        @change="applyFilter"
        class="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Years</option>
        <option v-for="year in getYearOptions()" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <Button @click="applyFilter" size="sm">
        Apply
      </Button>
      <Button v-if="filterYear" @click="clearFilter" variant="gray" size="sm">
        Clear
      </Button>
    </div>

    <!-- personal taxes loading / error -->
    <div v-if="loading" class="flex items-center py-4 text-gray-500">
      <svg class="animate-spin h-6 w-6 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Loading tasks...
    </div>
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- task list -->
    <div v-else>
      <Button @click="emit('new')" class="mb-4">New Record</Button>

      <div v-if="personalTaxes.length === 0" class="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
        No records found.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="task in personalTaxes"
          :key="task._id || task.id"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ task.taskDescription || 'Untitled Task' }}</h4>
              <p class="text-sm text-gray-500">Year: {{ task.taxYear || '—' }}</p>
            </div>
            <Button @click="emit('edit', task)" variant="link" class="whitespace-nowrap">
              Edit
            </Button>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.status || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.priority || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Case Worker</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.caseWorker || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervisor</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.supervisorId || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(task.startDate) }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Documents From</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.documentsFrom || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Target Due</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(task.targetDueDate) }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed Date</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(task.actualCompletedDate) }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blocker</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.blocker || '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Receivable</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.receivable != null ? `$${task.receivable.toFixed(2)}` : '—' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.invoice ? 'Yes' : 'No' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.paid ? 'Yes' : 'No' }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</p>
              <p class="mt-1 text-sm text-gray-900">{{ task.payment != null ? `$${task.payment.toFixed(2)}` : '—' }}</p>
            </div>
          </div>

          <div class="mt-4 rounded-lg bg-gray-50 p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>
            <p class="mt-2 text-sm text-gray-900 whitespace-pre-line">{{ task.notes || 'No notes available.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>