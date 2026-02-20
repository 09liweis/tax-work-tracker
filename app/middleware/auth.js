export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const authenticated = localStorage.getItem('authenticated')
    if (!authenticated) {
      return navigateTo('/login')
    }
  }
})