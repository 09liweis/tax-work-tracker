<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  service: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const formData = ref({
  name: '',
  price: ''
})

const title = computed(() => {
  return props.isEditing ? 'Edit Personal Tax Service' : 'Add New Personal Tax Service'
})

const categoryLabel = computed(() => {
  const categoryMap = {
    'basic': 'Basic Services',
    'complex': 'Complex Services',
    'international': 'International',
    'forms': 'Forms'
  }
  return categoryMap[formData.value.category] || formData.value.category
})

watch(() => props.visible, (newVal) => {
  if (newVal && props.service) {
    formData.value = {
      name: props.service.name || '',
      price: props.service.price || ''
    }
  } else if (newVal) {
    formData.value = {
      name: '',
      price: ''
    }
  }
}, { immediate: true })

const save = async () => {
  if (!formData.value.name || !formData.value.price) {
    alert('Please fill in the required fields')
    return
  }

  try {
    const payload = {
      ...formData.value,
      id: props.isEditing ? props.service.id || props.service._id : null
    }

    const res = await $fetch('/api/personal-tax-services/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: payload
    })

    if (res.success) {
      emit('saved', res.service)
    } else {
      alert(res.error || 'Failed to save service')
    }
  } catch (err) {
    alert(err?.message || 'Failed to save service')
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
        <p class="text-sm text-blue-100 mt-1">{{ isEditing ? 'Update service information' : 'Enter service details' }}</p>
      </div>

      <!-- Form Content -->
      <div class="px-6 py-6 overflow-y-auto max-h-[calc(90vh-160px)]">
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label for="serviceName" class="block text-sm font-semibold text-gray-700 mb-2">Service Name *</label>
            <input
              id="serviceName"
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Personal Tax Return"
              required
            >
          </div>

          <div>
            <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">Price (CAD) *</label>
            <input
              id="price"
              v-model="formData.price"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 65.00"
              required
            >
          </div>

        </form>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <Button type="button" @click="$emit('close')" variant="outline">Cancel</Button>
        <Button type="button" @click="save" variant="blue">{{ isEditing ? 'Update Service' : 'Add Service' }}</Button>
      </div>
    </div>
  </div>
</template>
