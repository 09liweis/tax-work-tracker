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
  <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    :step="step"
    :min="min"
    :max="max"
    :class="['mt-1 block w-full border rounded p-2', error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
    :disabled="disabled"
  />
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</div>
</template>