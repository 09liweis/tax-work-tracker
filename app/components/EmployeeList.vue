<script setup>
const props = defineProps({
  employees: { type: Array, default: () => [] },
  isAdmin: { type: Boolean, default: false }
})
const emit = defineEmits(["edit","delete"])

const onEdit = (e, emp) => {
  e.stopPropagation()
  emit('edit', emp)
}
const onDelete = (e, id) => {
  e.stopPropagation()
  emit('delete', id)
}
</script>

<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="employee in employees" :key="employee._id">
      <NuxtLink :to="`/dashboard/admin/employees/${employee._id}`" class="block hover:bg-gray-50">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ employee.email.charAt(0) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ employee.name }}</div>
                <div class="text-sm text-gray-500">{{ employee.role }} • {{ employee.email }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span
                :class="employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ employee.status }}
              </span>
              <button
                v-if="isAdmin"
                @click="onEdit($event, employee)"
                class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit
              </button>
              <button
                v-if="isAdmin"
                @click="onDelete($event, employee.id)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </NuxtLink>
    </li>
    <li v-if="employees.length === 0" class="text-sm text-gray-500">No employees found.</li>
  </ul>
</template>
