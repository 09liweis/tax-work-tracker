<script setup>
defineProps({
  recentClients: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200">
    <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-base sm:text-lg font-semibold text-slate-900">Recent Clients</h3>
      <span class="text-xs sm:text-sm text-slate-500">{{ recentClients.length }} {{ recentClients.length === 1 ? 'client' : 'clients' }}</span>
    </div>
    <div class="p-4 sm:p-6">
      <div v-if="recentClients.length === 0" class="text-center py-8 sm:py-12 text-slate-500">
        <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p class="text-sm">No clients yet</p>
      </div>
      <div v-else class="space-y-2 sm:space-y-3">
        <NuxtLink
          v-for="client in recentClients"
          :key="client._id"
          :to="`/dashboard/clients/${client._id}`"
          class="flex items-center p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div class="flex-shrink-0">
            <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ client.name.charAt(0) }}</span>
            </div>
          </div>
          <div class="ml-3 sm:ml-4 flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">{{ client.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ client.email || 'No email' }}</p>
          </div>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
