<script setup>
const props = defineProps({
  personalTaxes: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: String
})

const emit = defineEmits(["new", "edit"])
</script>

<template>
  <div class="mt-8">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Tax Records</h3>

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