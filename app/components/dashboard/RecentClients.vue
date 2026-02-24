<script setup>
defineProps({
  recentClients: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Recent Clients</h3>
    </div>
    <div class="p-6">
      <div v-if="recentClients.length === 0" class="text-center py-8 text-gray-500">
        No clients yet
      </div>
      <div v-else class="space-y-4">
        <NuxtLink
          v-for="client in recentClients"
          :key="client._id"
          :to="`/dashboard/clients/${client._id}`"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ client.name.charAt(0) }}</span>
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-700">{{ client.name }}</p>
            <p class="text-xs text-gray-500">{{ client.email || 'No email' }}</p>
          </div>
          <div class="flex-shrink-0">
            <span :class="client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ client.status }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
