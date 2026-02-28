<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  id: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  step: [String, Number],
  min: [String, Number],
  max: [String, Number]
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
<div>
  <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 mb-2">{{ label }}</label>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    :step="step"
    :min="min"
    :max="max"
    :class="[
      'block w-full px-4 py-2.5 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
      error
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400',
      disabled ? 'bg-gray-100 cursor-not-allowed' : ''
    ]"
    :disabled="disabled"
  />
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</div>
</template>