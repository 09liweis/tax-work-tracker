<script setup>
defineProps({
  services: {
    type: Array,
    default: () => []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(price)
}

</script>

<template>
  <div class="divide-y divide-gray-200">
    <div v-if="services.length === 0" class="px-4 py-10 text-center text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No services</h3>
      <p class="mt-1 text-sm text-gray-500">No personal tax services have been added yet.</p>
    </div>

    <div v-for="service in services" :key="service.id || service._id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3">
            <p class="text-sm font-medium text-indigo-600 truncate">{{ service.name }}</p>
          </div>
          <div class="mt-1">
            <p class="text-lg font-bold text-gray-900">{{ formatPrice(service.price) }}</p>
          </div>
        </div>
        <div v-if="isAdmin" class="flex space-x-2 ml-4">
          <Button @click="$emit('edit', service)" variant="outline" size="sm">Edit</Button>
          <Button @click="$emit('delete', service.id || service._id)" variant="danger" size="sm">Delete</Button>
        </div>
      </div>
    </div>
  </div>
</template>
