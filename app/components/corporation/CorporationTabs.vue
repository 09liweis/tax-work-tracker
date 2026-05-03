<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  taxCount: {
    type: Number,
    default: 0
  },
  payrollCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const tabs = computed(() => [
  { id: 'tax', label: 'Corporate Tax Tasks', count: props.taxCount },
  { id: 'payroll', label: 'Payroll Records', count: props.payrollCount }
])

const setActiveTab = (tabId) => {
  emit('update:modelValue', tabId)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          :class="[
            modelValue === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" :class="[
            modelValue === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600',
            'ml-2 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium'
          ]">
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>
  </div>
</template>
