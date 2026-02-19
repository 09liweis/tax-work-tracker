<script lang="ts">
  import { push } from 'svelte-spa-router';

  function handleLogout() {
    push('/');
  }
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-900">Tax Firm Management</h1>
        </div>
        <div class="flex items-center">
          <button
            on:click={handleLogout}
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p class="mt-1 text-sm text-gray-600">Manage your work progress</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Employees</h3>
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-gray-600 text-sm mb-4">Manage employee information and assignments</p>
        <div class="border-t pt-4">
          <p class="text-2xl font-bold text-gray-900">0</p>
          <p class="text-xs text-gray-500 mt-1">Total employees</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Clients</h3>
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p class="text-gray-600 text-sm mb-4">Track client cases and documentation</p>
        <div class="border-t pt-4">
          <p class="text-2xl font-bold text-gray-900">0</p>
          <p class="text-xs text-gray-500 mt-1">Total clients</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Corporations</h3>
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p class="text-gray-600 text-sm mb-4">Manage corporate tax accounts</p>
        <div class="border-t pt-4">
          <p class="text-2xl font-bold text-gray-900">0</p>
          <p class="text-xs text-gray-500 mt-1">Total corporations</p>
        </div>
      </div>
    </div>
  </main>
</div>
