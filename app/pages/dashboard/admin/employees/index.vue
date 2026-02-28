<script setup>
import { ref, onMounted } from 'vue'
import EmployeeList from '~/components/EmployeeList.vue'
import EmployeeModal from '~/components/EmployeeModal.vue'
import { useUser } from '~/composables/useUser'
import { apiGet, apiDelete } from '~/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Employees - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Manage your team members and employees in the tax work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const employees = ref([])
const isLoading = ref(true)
const fetchError = ref('')

const userStore = useUser()
const { loginUser } = userStore
const isAdmin = ref(false)

const fetchEmployees = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await apiGet('/api/users')
    if (!res.success) throw new Error(res.error || 'Failed to load employees')
    employees.value = res.users;
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading employees'
  } finally {
    isLoading.value = false
  }
}

// modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentEmployee = ref(null)

const openAddModal = () => {
  isEditing.value = false
  currentEmployee.value = null
  isModalOpen.value = true
}

const openEditModal = (emp) => {
  isEditing.value = true
  currentEmployee.value = { ...emp }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSaved = (saved) => {
  fetchEmployees();
  closeModal()
}

const deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to delete this employee?')) return
  try {
    const res = await apiDelete(`/api/users/${id}`)
    if (!res.success) throw new Error(res.error || 'Delete failed')
    employees.value = employees.value.filter(e => String(e.id) !== String(id))
  } catch (err) {
    alert(err?.message || 'Unable to delete employee')
  }
}

onMounted(async () => {
  // ensure global user is populated
  isAdmin.value = loginUser.value?.role === 'admin'
  if (!isAdmin.value) {
    fetchError.value = 'Only administrators can access this page'
    isLoading.value = false
    return
  }
  await fetchEmployees()
})
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your employees and their roles.</p>
          </div>
          <Button v-if="isAdmin" @click="openAddModal">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Employee
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="px-4 py-10 text-center text-gray-500">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Loading employees...
      </div>
      <div v-else-if="fetchError" class="px-4 py-6">
        <div class="rounded-md bg-red-50 p-4 flex items-center justify-between">
          <p class="text-sm text-red-700">{{ fetchError }}</p>
          <Button @click="fetchEmployees" variant="link" class="ml-4">Retry</Button>
        </div>
      </div>
      <div v-else>
        <EmployeeList
          :employees="employees"
          :isAdmin="isAdmin"
          @edit="openEditModal"
          @delete="deleteEmployee"
        />
      </div>
    </div>

    <EmployeeModal
      :visible="isModalOpen"
      :employee="currentEmployee"
      :isEditing="isEditing"
      :isAdmin="isAdmin"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>
