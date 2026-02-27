<script setup>
defineProps({
  userName: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="mb-6 sm:mb-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
      Welcome back{{ userName ? ', ' + userName : '' }} 👋
    </h1>
    <p class="mt-2 text-slate-500 text-sm sm:text-base">Here's what's happening with your tax practice today</p>
  </div>
</template>
