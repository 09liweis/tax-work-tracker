<script setup>
defineProps({
  clients: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['edit', 'retry'])
</script>

<template>
  <div class="px-6 py-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg class="animate-spin h-10 w-10 mb-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <p class="text-sm font-medium">Loading clients...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
      <div class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 mb-4">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
      <button
        @click="emit('retry')"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="clients.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div class="p-4 bg-blue-50 rounded-full mb-4">
        <svg class="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">No clients yet</h3>
      <p class="text-sm text-gray-500 max-w-xs text-center mb-4">Add your first client to start tracking their tax information.</p>
    </div>

    <!-- Client grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ClientsClientCard
        v-for="client in clients"
        :key="client.id"
        :client="client"
        @edit="emit('edit', $event)"
      />
    </div>
  </div>
</template>
