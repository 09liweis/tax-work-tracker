<script setup>
const props = defineProps({
  relative: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this relative?')) {
    emit('delete')
  }
}
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
    <div class="flex-shrink-0">
      <div class="p-3 bg-purple-100 rounded-lg">
        <svg class="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 mb-2">
        <p class="font-semibold text-gray-900 text-lg">{{ relative.name }}</p>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {{ relative.relationShipToClient }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <RelativeDetailItem icon-type="phone" label="Phone" :value="relative.telephone" />
        <RelativeDetailItem icon-type="email" label="Email" :value="relative.email" />
        <RelativeDetailItem icon-type="calendar" label="DOB" :value="relative.dob" />
        <RelativeDetailItem icon-type="id" label="SIN" :value="relative.sin" />
      </div>
    </div>

    <div class="flex-shrink-0 flex items-center gap-2">
      <button
        @click="emit('edit')"
        class="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
        title="Edit relative"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        @click="handleDelete"
        class="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        title="Delete relative"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
