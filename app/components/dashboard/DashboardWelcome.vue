<script setup>
defineProps({
  userName: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">
      Welcome back{{ userName ? ', ' + userName : '' }}
    </h1>
    <p class="mt-2 text-gray-600">Here's what's happening with your tax practice today</p>
  </div>
</template>
