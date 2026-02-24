<script setup>
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div class="p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ stats.totalClients }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div class="p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ stats.completedTasks }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div class="p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ stats.pendingTasks }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div class="p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
