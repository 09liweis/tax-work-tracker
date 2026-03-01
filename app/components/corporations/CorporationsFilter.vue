<script setup>
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters', 'apply', 'clear'])

const updateFilter = (key, value) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

const handleKeyUp = (event, key) => {
  if (event.key === 'Enter') {
    emit('apply')
  }
}
</script>

<template>
  <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-gray-700">Filter Corporations</h3>
      <button
        @click="emit('clear')"
        class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
      >
        Clear All
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
        <input
          :value="filters.name"
          @input="updateFilter('name', $event.target.value)"
          @keyup="handleKeyUp($event, 'name')"
          type="text"
          placeholder="Search by name"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">BN Number</label>
        <input
          :value="filters.bnNumber"
          @input="updateFilter('bnNumber', $event.target.value)"
          @keyup="handleKeyUp($event, 'bnNumber')"
          type="text"
          placeholder="Search by BN number"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
        />
      </div>
    </div>
    <div class="mt-3 flex justify-end">
      <Button
        @click="emit('apply')"
        variant="primary"
        class="px-4 py-2 text-sm"
      >
        Apply Filters
      </Button>
    </div>
  </div>
</template>
