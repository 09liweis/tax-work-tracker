<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Employees - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Manage your team members and employees in the tax work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Sample employee data
const employees = [
  { id: 1, name: 'Alice Johnson', role: 'Tax Accountant', email: 'alice@company.com', status: 'Active' },
  { id: 2, name: 'Bob Smith', role: 'CPA', email: 'bob@company.com', status: 'Active' },
  { id: 3, name: 'Carol Davis', role: 'Tax Preparer', email: 'carol@company.com', status: 'On Leave' },
  { id: 4, name: 'David Wilson', role: 'Senior Accountant', email: 'david@company.com', status: 'Active' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="text-indigo-600 hover:text-indigo-500 mr-4">
              ← Back to Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Employees</h1>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your employees and their roles.</p>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="employee in employees" :key="employee.id">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">{{ employee.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ employee.name }}</div>
                      <div class="text-sm text-gray-500">{{ employee.role }} • {{ employee.email }}</div>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span
                      :class="employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ employee.status }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      if (process.client) {
        localStorage.removeItem('authenticated')
        this.$router.push('/login')
      }
    }
  }
}
</script>