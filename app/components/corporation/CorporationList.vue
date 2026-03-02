<script setup>
const props = defineProps({
  corporations: Array,
})

</script>
<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="corp in corporations" :key="corp.id">
      <NuxtLink :to="`/dashboard/corporations/${corp.id}`" class="block hover:bg-gray-50">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-start justify-between">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-12 w-12">
                <div class="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <span class="text-base font-medium text-white">{{ corp.name.charAt(0) }}</span>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center gap-2">
                  <p class="text-base font-semibold text-gray-900">{{ corp.name }}</p>
                  <span
                    :class="corp.status === 'Active' ? 'bg-green-100 text-green-800' : corp.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                    {{ corp.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-0.5">{{ corp.industry || '—' }}</p>
                <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div v-if="corp.bnNumber" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span class="font-medium">BN:</span> {{ corp.bnNumber }}
                  </div>
                  <div v-if="corp.federalNo" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="font-medium">Fed:</span> {{ corp.federalNo }}
                  </div>
                  <div v-if="corp.provincialNo" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="font-medium">Prov:</span> {{ corp.provincialNo }}
                  </div>
                  <div v-if="corp.wsibNo" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="font-medium">WSIB:</span> {{ corp.wsibNo }}
                  </div>
                </div>
                <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <div v-if="corp.primaryContact" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ corp.primaryContact }}
                  </div>
                  <div v-if="corp.mainEmail" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ corp.mainEmail }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 ml-4">
              <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </NuxtLink>
    </li>
    <li v-if="corporations.length === 0" class="px-4 py-8 text-center">
      <div class="flex flex-col items-center">
        <svg class="w-12 h-12 text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p class="text-sm font-medium text-gray-600 mb-1">No corporations added yet</p>
        <p class="text-xs text-gray-400">Click "Add Corporation" to get started</p>
      </div>
    </li>
  </ul>
</template>