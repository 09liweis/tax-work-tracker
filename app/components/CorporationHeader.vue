<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-8">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <div class="h-20 w-20 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <span class="text-3xl font-bold text-white">{{ corp.name.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white mb-1">{{ corp.name }}</h1>
            <p class="text-slate-300 text-sm">{{ corp.industry || 'Corporate Client' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="emit('edit')"
            class="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 backdrop-blur-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit
          </button>
          <span
            :class="{
              'bg-green-100 text-green-700 border-green-200': corp.status === 'Active',
              'bg-yellow-100 text-yellow-700 border-yellow-200': corp.status === 'Under Review',
              'bg-gray-100 text-gray-700 border-gray-200': corp.status === 'Inactive'
            }"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border"
          >
            <span class="w-2 h-2 rounded-full mr-2" :class="{
              'bg-green-500': corp.status === 'Active',
              'bg-yellow-500': corp.status === 'Under Review',
              'bg-gray-500': corp.status === 'Inactive'
            }"></span>
            {{ corp.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  corp: { type: Object, required: true }
})

const emit = defineEmits(['edit'])
</script>
