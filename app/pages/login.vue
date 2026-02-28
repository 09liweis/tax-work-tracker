<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to Tax Work Tracker</p>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-8">
          <form @submit.prevent="login" class="space-y-6">
            <!-- Error Message -->
            <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm text-red-700 font-medium">{{ error }}</p>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="space-y-5">
              <BaseInput
                id="email"
                v-model="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                :disabled="loading"
                autocomplete="email"
              />

              <BasePasswordInput
                id="password"
                v-model="password"
                label="Password"
                placeholder="Enter your password"
                :disabled="loading"
                autocomplete="current-password"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-cyan-600"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p class="text-xs text-center text-gray-500">
            Secure access to your tax management dashboard
          </p>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Professional tax work tracking and client management
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

import { useUser } from '~/composables/useUser'
import { apiPost } from '~/utils/api'
import BaseInput from '~/components/form/BaseInput.vue'
import BasePasswordInput from '~/components/form/BasePasswordInput.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }

  loading.value = true
  try {
    const response = await apiPost('/api/users/login', {
      email: email.value,
      password: password.value
    })

    if (response.success) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('authenticated', 'true')
      // store role returned by server for quick checks
      if (response.role) localStorage.setItem('role', response.role)
      // populate global user object
      const { fetchMe } = useUser()
      await fetchMe()
      navigateTo('/dashboard')
    } else {
      error.value = response.error || 'Login failed'
    }
  } catch (e) {
    error.value = e.data?.error || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>