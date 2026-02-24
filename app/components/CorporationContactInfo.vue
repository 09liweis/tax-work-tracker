<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
      Contact Details
    </h2>
    <div class="space-y-3">
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Primary Contact</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.primaryContact || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Phone</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.mainPhone || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
        <p class="mt-1 text-sm text-gray-900 break-words">{{ corp.mainEmail || '—' }}</p>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
        <p class="mt-1 text-sm text-gray-900">{{ corp.address || '—' }}</p>
      </div>
      <div v-if="client" class="pt-3 border-t border-gray-100">
        <label class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">Associated Client</label>
        <NuxtLink :to="`/dashboard/clients/${client._id || client.id}`" class="block p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ client.name.charAt(0) }}</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-indigo-900">{{ client.name }}</p>
              <p class="text-xs text-indigo-600">{{ client.email || 'No email' }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  corp: { type: Object, required: true },
  client: { type: Object, default: null }
})
</script>
