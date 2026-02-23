import { defineNuxtPlugin } from '#app'
import { useUser } from '~/composables/useUser'

export default defineNuxtPlugin(async () => {
  if (process.client) {
    const { fetchMe } = useUser()
    await fetchMe()
  }
})
