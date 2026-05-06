<script setup>
import { SITE_TITLE } from '../utils/constants'

useHead({
  title: SITE_TITLE,
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
