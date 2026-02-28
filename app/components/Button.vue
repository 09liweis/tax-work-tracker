<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'blue' | 'success' | 'info' | 'danger' | 'ghost' | 'outline' | 'gray' | 'gradient-blue' | 'gradient-purple' | 'link'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent focus:ring-indigo-500',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white border-transparent focus:ring-cyan-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent focus:ring-gray-500 shadow-none',
    outline: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    gray: 'bg-gray-300 text-gray-700 hover:bg-gray-400 border-transparent focus:ring-gray-500',
    'gradient-blue': 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-transparent focus:ring-blue-500',
    'gradient-purple': 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-transparent focus:ring-indigo-500',
    link: 'text-indigo-600 hover:text-indigo-900 hover:underline bg-transparent border-transparent focus:ring-indigo-500 shadow-none p-0 rounded-none',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-md',
    md: 'px-4 py-2 text-sm font-medium rounded-lg',
    lg: 'px-6 py-3 text-sm font-semibold rounded-lg',
  }
  return sizes[props.size]
})

const disabledClasses = computed(() => {
  if (props.disabled || props.loading) {
    return 'opacity-50 cursor-not-allowed'
  }
  return ''
})

const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border shadow-sm'
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses,
      sizeClasses,
      disabledClasses,
      block ? 'w-full' : ''
    ]"
    @click="handleClick"
  >
    <slot name="icon">
      <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </slot>
    <slot />
  </button>
</template>
