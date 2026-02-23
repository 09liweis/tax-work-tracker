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
        <div>
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
</script>
