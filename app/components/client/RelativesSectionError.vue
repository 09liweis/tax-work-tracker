<script setup>
const props = defineProps({
  error: String
})
</script>

<template>
  <div class="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
    <svg class="w-5 h-5 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-sm text-red-700">{{ error }}</p>
  </div>
</template>
