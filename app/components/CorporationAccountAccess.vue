<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
      Account Access Information
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">ISED Account ID</label>
        <p class="mt-1 text-sm text-gray-900 font-mono">{{ corp.isedAccountId || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Federal Key</label>
        <p class="mt-1 text-sm text-gray-900 font-mono">{{ corp.federalKey || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Key</label>
        <p class="mt-1 text-sm text-gray-900 font-mono">{{ corp.companyKey || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">ONE KEY ID</label>
        <p class="mt-1 text-sm text-gray-900 font-mono">{{ corp.oneKeyId || '—' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  corp: { type: Object, required: true }
})
</script>
