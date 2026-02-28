<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center text-gray-900 hover:text-gray-600 mr-6">
              <div class="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                <span class="text-white text-sm font-bold">T</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Tax Tracker</span>
            </NuxtLink>
            <nav class="hidden md:flex space-x-8">
              <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" active-class="text-indigo-600">
                Dashboard
              </NuxtLink>
              <NuxtLink
                v-if="isAdmin"
                to="/dashboard/admin"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-indigo-600"
              >
                Admin
              </NuxtLink>
              <NuxtLink to="/dashboard/clients" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" active-class="text-indigo-600">
                Clients
              </NuxtLink>
              <NuxtLink to="/dashboard/corporations" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" active-class="text-indigo-600">
                Corporations
              </NuxtLink>
            </nav>
          </div>
          <Button @click="logout" variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import { computed } from 'vue'
import { useUser } from '~/composables/useUser'

const { loginUser } = useUser()
const isAdmin = computed(() => process.client && loginUser.value?.role === 'admin')

const logout = () => {
  if (process.client) {
    localStorage.removeItem('authenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    loginUser.value = null
    navigateTo('/login')
  }
}
</script>
