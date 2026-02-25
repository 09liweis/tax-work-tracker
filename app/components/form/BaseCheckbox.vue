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

<template>
<div>
  <label :for="id" class="group relative flex items-center cursor-pointer select-none">
    <input
      :id="id"
      type="checkbox"
      class="peer sr-only"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="disabled"
    />
    <div
      class="relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ease-out"
      :class="[
        disabled
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
          : modelValue
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent shadow-lg shadow-indigo-500/30'
            : 'bg-white border-gray-300 peer-hover:border-indigo-400 peer-hover:shadow-md peer-active:scale-95'
      ]"
    >
      <!-- Background pattern when checked -->
      <div
        v-if="modelValue"
        class="absolute inset-0 rounded-lg overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      <!-- Checkmark with animation -->
      <svg
        v-if="modelValue"
        class="w-3.5 h-3.5 text-white relative z-10 transition-all duration-300"
        :class="[
          modelValue ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        ]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <!-- Label with enhanced styling -->
    <span v-if="label" class="ml-3 text-sm font-medium transition-all duration-300 relative"
      :class="[
        disabled ? 'text-gray-400' : 'text-gray-700'
      ]"
    >
      <span class="relative z-10">{{ label }}</span>
      <!-- Underline animation on hover -->
      <span
        v-if="!disabled"
        class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full"
      ></span>
    </span>
  </label>
  <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1.5">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm9-2a1 1 0 11-2 0 1 1 0 012 0zm-1.293-5.293a1 1 0 00-1.414-1.414L10 9.586 7.707 8.293a1 1 0 10-1.414 1.414L8.586 11l-2.293-2.293a1 1 0 111.414-1.414L10 9.586z" clip-rule="evenodd" />
    </svg>
    {{ error }}
  </p>
</div>
</template>
