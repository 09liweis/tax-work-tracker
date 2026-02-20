<script setup>
useHead({
  title: 'Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Professional tax work tracking and client management system.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const authenticated = ref(false)

onMounted(() => {
  if (process.client) {
    authenticated.value = !!localStorage.getItem('authenticated')
    if (authenticated.value) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  }
})
</script>

<template>
  <div v-if="!authenticated">Redirecting...</div>
</template>
