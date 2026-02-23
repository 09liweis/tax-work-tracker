<template>
  <div v-if="note" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
    <h2 class="text-sm font-semibold text-amber-900 mb-2 flex items-center">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
      </svg>
      Notes
    </h2>
    <p class="text-sm text-gray-700">{{ note }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  note: { type: String, default: '' }
})
</script>
