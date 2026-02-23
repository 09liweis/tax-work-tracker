<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  id: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  rows: { type: Number, default: 4 }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
<div>
  <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
  <textarea
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    :rows="rows"
    :class="['mt-1 block w-full border rounded p-2', error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
    :disabled="disabled"
  />
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</div>
</template>