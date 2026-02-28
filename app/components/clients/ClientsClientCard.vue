<script setup>
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-400'
  const colors = [
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-rose-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-sky-500'
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <div class="relative group">
    <NuxtLink :to="`/dashboard/clients/${client.id}`" class="block">
      <div class="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div :class="['h-12 w-12 rounded-full flex items-center justify-center', getAvatarColor(client.name)]">
              <span class="text-base font-semibold text-white">{{ getInitials(client.name) }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-4">
              <h3 class="text-base font-semibold text-gray-900 truncate">{{ client.name || 'Unnamed Client' }}</h3>
              <Button
                @click.prevent.stop="emit('edit', client)"
                variant="ghost"
                size="sm"
                class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 rounded-lg"
                title="Edit client"
              >
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            </div>

            <div class="mt-2 space-y-1">
              <div v-if="client.email" class="flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="truncate">{{ client.email }}</span>
              </div>
              <div v-if="client.telephone" class="flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ client.telephone }}</span>
              </div>
              <div v-if="client.address" class="flex items-start gap-2 text-sm text-gray-500">
                <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="truncate">{{ client.address }}</span>
              </div>
            </div>

            <div v-if="client.city || client.province" class="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <span v-if="client.city">{{ client.city }}</span>
              <span v-if="client.city && client.province">·</span>
              <span v-if="client.province">{{ client.province }}</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
