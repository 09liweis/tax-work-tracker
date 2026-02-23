<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
    <div class="bg-white px-6 py-4">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">BN Number</div>
      <div class="text-sm font-medium text-gray-900">{{ corp.bnNumber || '—' }}</div>
    </div>
    <div class="bg-white px-6 py-4">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Federal No.</div>
      <div class="text-sm font-medium text-gray-900">{{ corp.federalNo || '—' }}</div>
    </div>
    <div class="bg-white px-6 py-4">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Provincial No.</div>
      <div class="text-sm font-medium text-gray-900">{{ corp.provincialNo || '—' }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  corp: { type: Object, required: true }
})
</script>
