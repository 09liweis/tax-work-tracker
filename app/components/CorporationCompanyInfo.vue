<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      Company Information
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Incorporated Date</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.incorporatedDate ? new Date(corp.incorporatedDate).toLocaleDateString() : '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year End</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.endingPeriod ? new Date(corp.endingPeriod).toLocaleDateString() : '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">WSIB No.</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.wsibNo || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Code</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.accessCode || '—' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  corp: { type: Object, required: true }
})
</script>
