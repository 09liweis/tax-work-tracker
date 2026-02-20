<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
          <span class="text-white text-xl font-bold">T</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Tax Work Tracker
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Manage your tax clients and projects efficiently
        </p>
      </div>
      <form class="mt-8 space-y-6 bg-white py-8 px-6 shadow-lg rounded-lg" @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password"
              v-model="password"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign in
          </button>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Demo: Use any email and password to login
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Login - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Sign in to your Tax Work Tracker account to manage clients and projects.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const email = ref('')
const password = ref('')

const login = () => {
  // Simple auth: check if email and password are not empty
  if (email.value && password.value) {
    // For demo, any email/pass works
    localStorage.setItem('authenticated', 'true')
    navigateTo('/dashboard')
  } else {
    alert('Please enter email and password')
  }
}
</script>