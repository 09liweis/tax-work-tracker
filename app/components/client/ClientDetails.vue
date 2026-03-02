<script setup>
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Personal Information
      </h2>
    </div>
    <div class="p-6 space-y-4">
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
        <p class="mt-1 text-sm text-gray-900">{{ client.gender || '—' }}</p>
      </div>
      <div class="pt-4 border-t border-gray-100">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
        <p class="mt-1 text-sm text-gray-900">{{ client.address || '—' }}</p>
        <p v-if="client.city || client.province" class="mt-1 text-sm text-gray-900">
          {{ [client.city, client.province].filter(Boolean).join(', ') }}
        </p>
      </div>
      <div v-if="client.postalCode" class="pt-4 border-t border-gray-100">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Postal Code</label>
        <p class="mt-1 text-sm text-gray-900">{{ client.postalCode }}</p>
      </div>
    </div>
  </div>
</template>
