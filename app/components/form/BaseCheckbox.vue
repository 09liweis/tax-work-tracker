<script setup>
const props = defineProps({
  modelValue: Boolean,
  label: String,
  id: String,
  disabled: Boolean,
  error: String
})
const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
<div class="relative">
  <!-- Custom Toggle Switch -->
  <div
    class="group relative flex items-center cursor-pointer select-none"
    :class="{ 'cursor-not-allowed opacity-50': disabled }"
    @click="toggle"
  >
    <!-- Toggle Container -->
    <div
      class="relative w-14 h-8 rounded-full transition-all duration-500 ease-out overflow-hidden"
      :class="[
        modelValue
          ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30'
          : 'bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner'
      ]"
    >
      <!-- Animated Background Particles -->
      <div v-if="modelValue" class="absolute inset-0">
        <div class="absolute w-20 h-20 -top-4 -left-4 bg-white/10 rounded-full animate-pulse"></div>
        <div class="absolute w-16 h-16 -bottom-3 -right-3 bg-white/15 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
      </div>

      <!-- Toggle Knob -->
      <div
        class="absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow-xl"
        :class="[
          modelValue
            ? 'translate-x-6 bg-white'
            : 'bg-gray-300 shadow-inner'
        ]"
      >
        <!-- Check Icon when checked -->
        <svg
          v-if="modelValue"
          class="w-4 h-4 text-emerald-500 transition-all duration-300"
          :class="modelValue ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <!-- Minus Icon when unchecked -->
        <svg
          v-else
          class="w-3 h-3 text-gray-500 transition-all duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    </div>

    <!-- Label with animated effect -->
    <span
      v-if="label"
      class="ml-4 text-sm font-semibold transition-all duration-300 relative overflow-hidden"
      :class="[
        disabled ? 'text-gray-400' : modelValue ? 'text-gray-800' : 'text-gray-500'
      ]"
    >
      <span class="relative z-10 block">
        {{ label }}
        <span
          v-if="modelValue"
          class="inline-block ml-1.5 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium"
        >
          Active
        </span>
      </span>
      <!-- Shimmer effect on hover -->
      <div
        v-if="!disabled && modelValue"
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"
      ></div>
    </span>
  </div>

  <!-- Error Message -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <p v-if="error" class="mt-2 text-sm text-red-500 flex items-center gap-2 font-medium">
      <svg class="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm9-2a1 1 0 11-2 0 1 1 0 012 0zm-1.293-5.293a1 1 0 00-1.414-1.414L10 9.586 7.707 8.293a1 1 0 10-1.414 1.414L8.586 11l-2.293-2.293a1 1 0 111.414-1.414L10 9.586z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </transition>
</div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>
