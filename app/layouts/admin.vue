<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Header with Navigation -->
    <header class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink to="/dashboard/admin" class="flex items-center text-white hover:text-gray-200 mr-6">
              <div class="h-8 w-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2">
                <span class="text-white text-sm font-bold">A</span>
              </div>
              <span class="text-xl font-bold text-white">Admin Panel</span>
            </NuxtLink>
            <!-- Admin Navigation -->
            <nav class="hidden md:flex space-x-1">
              <NuxtLink
                to="/dashboard/admin"
                class="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                active-class="bg-white/20 text-white"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </NuxtLink>
              <NuxtLink
                to="/dashboard/admin/employees"
                class="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                active-class="bg-white/20 text-white"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Employees
              </NuxtLink>
              <NuxtLink
                to="/dashboard/admin/personal-tax-services"
                class="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                active-class="bg-white/20 text-white"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Personal Tax Services
              </NuxtLink>
            </nav>
          </div>
          <!-- Back to Dashboard -->
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-200"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div class="md:hidden bg-white border-b border-gray-200 px-4 py-2">
      <nav class="flex space-x-2 overflow-x-auto">
        <NuxtLink
          to="/dashboard/admin"
          class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center gap-1"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Overview
        </NuxtLink>
        <NuxtLink
          to="/dashboard/admin/employees"
          class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center gap-1"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Employees
        </NuxtLink>
        <NuxtLink
          to="/dashboard/admin/personal-tax-services"
          class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center gap-1"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Tax Services
        </NuxtLink>
      </nav>
    </div>

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
</script>
