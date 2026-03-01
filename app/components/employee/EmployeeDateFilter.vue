<script setup>
const props = defineProps({
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' }
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'apply', 'clear'])

const updateStartDate = (value) => {
  emit('update:startDate', value)
}

const updateEndDate = (value) => {
  emit('update:endDate', value)
}

const handleApply = () => {
  emit('apply')
}

const handleClear = () => {
  emit('clear')
}
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          id="startDate"
          :value="startDate"
          @input="updateStartDate($event.target.value)"
          type="date"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          id="endDate"
          :value="endDate"
          @input="updateEndDate($event.target.value)"
          type="date"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
      </div>
      <div class="flex gap-2 items-end">
        <button
          @click="handleApply"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filter
        </button>
        <button
          @click="handleClear"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
