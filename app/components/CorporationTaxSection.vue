<script setup>
const props = defineProps({
  tasks: {
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
    <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Tax Tasks</h3>

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

    <div v-else>
      <button @click="emit('new')" class="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">New Task</button>
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-2 py-1 text-left">Type</th>
            <th class="border px-2 py-1">Category</th>
            <th class="border px-2 py-1">Year End</th>
            <th class="border px-2 py-1">Owner</th>
            <th class="border px-2 py-1">Status</th>
            <th class="border px-2 py-1">Priority</th>
            <th class="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tasks" :key="t._id">
            <td class="border px-2 py-1">{{ t.taskType }}</td>
            <td class="border px-2 py-1">{{ t.category }}</td>
            <td class="border px-2 py-1 text-center">{{ t.yearEnding }}</td>
            <td class="border px-2 py-1">{{ t.owner }}</td>
            <td class="border px-2 py-1 text-center">{{ t.status }}</td>
            <td class="border px-2 py-1 text-center">{{ t.priority }}</td>
            <td class="border px-2 py-1 text-center">
              <button @click="emit('edit', t)" class="text-indigo-600 hover:underline">Edit</button>
            </td>
          </tr>
          <tr v-if="tasks.length === 0">
            <td class="border px-2 py-2 text-center" colspan="7">No tasks found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
