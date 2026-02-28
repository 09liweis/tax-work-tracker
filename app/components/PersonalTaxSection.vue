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
  <div class="mt-8">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Records</h3>

    <!-- Year Filter -->
    <div class="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
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
              <Button @click="emit('edit', task)" variant="link">Edit</Button>
            </td>
          </tr>
          <tr v-if="personalTaxes.length === 0">
            <td class="border px-2 py-2 text-center" colspan="5">No records found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>