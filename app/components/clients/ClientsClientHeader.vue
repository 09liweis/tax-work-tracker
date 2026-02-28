<script setup>
const props = defineProps({
  clientCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['add-client'])
</script>

<template>
  <div class="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-200">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Clients</h1>
            <p class="text-sm text-blue-100 mt-1">
              <span class="font-medium">{{ clientCount }}</span>
              <span class="mx-1">·</span>
              Manage your tax clients
            </p>
          </div>
        </div>
      </div>
      <button
        @click="emit('add-client')"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Client
      </button>
    </div>
  </div>
</template>
