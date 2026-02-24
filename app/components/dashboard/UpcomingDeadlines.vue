<script setup>
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDaysUntil = (date) => {
  const today = new Date()
  const target = new Date(date)
  const diffTime = target - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return `${diffDays} days`
}

const getPriorityColor = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p.includes('high') || p.includes('urgent')) return 'text-red-600 bg-red-50 border-red-200'
  if (p.includes('medium')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-green-600 bg-green-50 border-green-200'
}

defineProps({
  upcomingDeadlines: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
    </div>
    <div class="p-6">
      <div v-if="upcomingDeadlines.length === 0" class="text-center py-8 text-gray-500">
        No upcoming deadlines
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(deadline, idx) in upcomingDeadlines"
          :key="idx"
          class="p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs font-medium text-gray-500">{{ deadline.type }}</span>
            <span class="text-xs font-semibold text-gray-900">{{ getDaysUntil(deadline.dueDate) }}</span>
          </div>
          <p class="text-sm font-medium text-gray-900 mb-1">{{ deadline.description || 'Untitled Task' }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ formatDate(deadline.dueDate) }}</span>
            <span v-if="deadline.priority" :class="getPriorityColor(deadline.priority)" class="text-xs px-2 py-0.5 rounded border font-medium">
              {{ deadline.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
