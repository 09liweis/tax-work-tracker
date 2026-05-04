<script setup>
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-10">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-5">
          <div class="h-24 w-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
            <span class="text-4xl font-bold text-white">{{ client.name.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">{{ client.name }}</h1>
            <div class="flex items-center space-x-4 text-blue-100">
              <span v-if="client.email" class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {{ client.email }}
              </span>
              <span v-if="client.telephone" class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {{ client.telephone }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Button @click="emit('edit')" class="bg-white/20 hover:bg-white/30 border-white/30">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit
          </Button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200">
      <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SIN</div>
            <div class="text-lg font-semibold text-gray-900">{{ client.sin || '—' }}</div>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</div>
            <div class="text-lg font-semibold text-gray-900">{{ client.dob ? new Date(client.dob).toLocaleDateString() : '—' }}</div>
          </div>
          <div class="h-12 w-12 bg-amber-100 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Marital Status</div>
            <div class="text-lg font-semibold text-gray-900">{{ client.maritalStatus || '—' }}</div>
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white px-6 py-5 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Updated</div>
            <div class="text-sm font-semibold text-gray-900">{{ formatDate(client.lts) }}</div>
          </div>
          <div class="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
