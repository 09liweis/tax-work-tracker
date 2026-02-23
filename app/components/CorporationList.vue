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
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ corp.name.charAt(0) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ corp.name }}</div>
                <div class="text-sm text-gray-500">{{ corp.industry }} • Tax ID: {{ corp.taxId }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-900 font-medium">{{ corp.revenue }}</div>
              <span
                :class="corp.status === 'Active' ? 'bg-green-100 text-green-800' : corp.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ corp.status }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </li>
    <li v-if="corporations.length === 0" class="text-sm text-gray-500">No corporations added yet.</li>
  </ul>
</template>