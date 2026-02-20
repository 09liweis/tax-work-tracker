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

// Reactive employee data
const employees = ref([
  { id: 1, name: 'Alice Johnson', role: 'Tax Accountant', email: 'alice@company.com', status: 'Active' },
  { id: 2, name: 'Bob Smith', role: 'CPA', email: 'bob@company.com', status: 'Active' },
  { id: 3, name: 'Carol Davis', role: 'Tax Preparer', email: 'carol@company.com', status: 'On Leave' },
  { id: 4, name: 'David Wilson', role: 'Senior Accountant', email: 'david@company.com', status: 'Active' }
])

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingEmployee = ref(null)

// Form data
const formData = ref({
  name: '',
  role: '',
  email: '',
  status: 'Active'
})

// Form validation
const formErrors = ref({})

// Open add modal
const openAddModal = () => {
  isEditing.value = false
  editingEmployee.value = null
  formData.value = { name: '', role: '', email: '', status: 'Active' }
  formErrors.value = {}
  showModal.value = true
}

// Open edit modal
const openEditModal = (employee) => {
  isEditing.value = true
  editingEmployee.value = employee
  formData.value = { ...employee }
  formErrors.value = {}
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  formData.value = { name: '', role: '', email: '', status: 'Active' }
  formErrors.value = {}
}

// Validate form
const validateForm = () => {
  formErrors.value = {}
  if (!formData.value.name.trim()) formErrors.value.name = 'Name is required'
  if (!formData.value.role.trim()) formErrors.value.role = 'Role is required'
  if (!formData.value.email.trim()) formErrors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(formData.value.email)) formErrors.value.email = 'Email is invalid'
  return Object.keys(formErrors.value).length === 0
}

// Save employee
const saveEmployee = () => {
  if (!validateForm()) return

  if (isEditing.value) {
    // Update existing employee
    const index = employees.value.findIndex(emp => emp.id === editingEmployee.value.id)
    if (index !== -1) {
      employees.value[index] = { ...formData.value, id: editingEmployee.value.id }
    }
  } else {
    // Add new employee
    const newId = Math.max(...employees.value.map(emp => emp.id)) + 1
    employees.value.push({ ...formData.value, id: newId })
  }

  closeModal()
}

// Delete employee
const deleteEmployee = (employeeId) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.value = employees.value.filter(emp => emp.id !== employeeId)
  }
}

const logout = () => {
  if (process.client) {
    localStorage.removeItem('authenticated')
    navigateTo('/login')
  }
}
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
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your employees and their roles.</p>
              </div>
              <button
                @click="openAddModal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add Employee
              </button>
            </div>
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
                  <div class="flex items-center space-x-3">
                    <span
                      :class="employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ employee.status }}
                    </span>
                    <button
                      @click="openEditModal(employee)"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteEmployee(employee.id)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg v-if="isEditing" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-white" id="modal-title">
                  {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
                </h3>
                <p class="text-indigo-100 text-sm">
                  {{ isEditing ? 'Update employee information' : 'Create a new team member' }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-6">
            <form @submit.prevent="saveEmployee" class="space-y-6">
              <div class="space-y-5">
                <!-- Name Field -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Full Name
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      placeholder="Enter full name"
                      class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': formErrors.name }"
                    />
                  </div>
                  <p v-if="formErrors.name" class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    {{ formErrors.name }}
                  </p>
                </div>

                <!-- Role Field -->
                <div>
                  <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"></path>
                      </svg>
                      Job Role
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      id="role"
                      v-model="formData.role"
                      placeholder="e.g., Tax Accountant, CPA"
                      class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': formErrors.role }"
                    />
                  </div>
                  <p v-if="formErrors.role" class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    {{ formErrors.role }}
                  </p>
                </div>

                <!-- Email Field -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email Address
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      type="email"
                      id="email"
                      v-model="formData.email"
                      placeholder="employee@company.com"
                      class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': formErrors.email }"
                    />
                  </div>
                  <p v-if="formErrors.email" class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    {{ formErrors.email }}
                  </p>
                </div>

                <!-- Status Field -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Employment Status
                    </span>
                  </label>
                  <div class="relative">
                    <select
                      id="status"
                      v-model="formData.status"
                      class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="On Leave">🟡 On Leave</option>
                      <option value="Inactive">🔴 Inactive</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeModal"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg v-if="isEditing" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {{ isEditing ? 'Update Employee' : 'Add Employee' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      if (process.client) {
        localStorage.removeItem('authenticated')
        navigateTo('/login')
      }
    }
  }
}
</script>