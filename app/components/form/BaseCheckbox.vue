<script setup>
const props = defineProps({
  modelValue: Boolean,
  label: String,
  id: String,
  disabled: Boolean,
  error: String
})
const emit = defineEmits(['update:modelValue'])
</script>

<div>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="disabled"
    />
    <label v-if="label" :for="id" class="ml-2 block text-sm text-gray-700">{{ label }}</label>
  </div>
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</div>