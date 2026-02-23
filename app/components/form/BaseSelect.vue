<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  options: { type: Array, default: () => [] },
  error: String,
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>

<div>
  <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
  <select
    :id="id"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    :disabled="disabled"
    class="mt-1 block w-full border rounded p-2 bg-white"
    :class="error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''"
  >
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    <slot />
  </select>
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</div>