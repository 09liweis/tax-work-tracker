<script setup>
import { watch, ref } from 'vue'
import BaseInput from '~/components/form/BaseInput.vue'
import BaseSelect from '~/components/form/BaseSelect.vue'

const props = defineProps({
  visible: Boolean,
  employee: {
    type: Object,
    default: null
  },
  isEditing: Boolean,
  isAdmin: { type: Boolean, default: false }
})

const emit = defineEmits(["close", "saved"])

const EMPTY_EMPLOYEE = {
  name: '',
  role: 'employee',
  email: '',
  status: 'Active',
  password: ''
};

const formData = ref(EMPTY_EMPLOYEE)
const formErrors = ref({})
const saving = ref(false)

watch(
  () => props.employee,
  (emp) => {
    if (emp) {
      formData.value = { ...emp }
      delete formData.value.id
      delete formData.value._id
      formData.value.password = ''
    } else {
      formData.value = EMPTY_EMPLOYEE;
    }
    formErrors.value = {}
  },
  { immediate: true }
)

const validate = () => {
  formErrors.value = {}
  if (!formData.value.name.trim()) formErrors.value.name = 'Name is required'
  if (!formData.value.role.trim()) formErrors.value.role = 'Role is required'
  if (!formData.value.email.trim()) formErrors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(formData.value.email)) formErrors.value.email = 'Email is invalid'
  if (!props.isEditing && !formData.value.password) formErrors.value.password = 'Password is required'
  if (formData.value.password && formData.value.password.length < 8) formErrors.value.password = 'Password must be at least 8 characters'
  return Object.keys(formErrors.value).length === 0
}

const save = async () => {
  if (!validate() || !props.isAdmin) return
  saving.value = true
  try {
    const token = localStorage.getItem('token')
    const payload = { ...formData.value }
    // determine endpoint/method
    let res
    if (props.isEditing && props.employee && props.employee._id) {
      res = await $fetch(`/api/users/${props.employee._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
    } else {
      res = await $fetch('/api/users/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
    }
    if (!res.success) throw new Error(res.error || 'Save failed')
    emit('saved', res.user || res.user)
  } catch (err) {
    formErrors.value.general = err?.message || 'An error occurred while saving employee'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="emit('close')">
      </div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg v-if="isEditing" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
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
          <form @submit.prevent="save" class="space-y-6">
            <div v-if="formErrors.general" class="text-sm text-red-600">{{ formErrors.general }}</div>
            <div class="space-y-5">
              <BaseInput id="name" v-model="formData.name" label="Full Name" placeholder="Enter full name"
                :error="formErrors.name" />
              <BaseSelect id="role" v-model="formData.role" label="Job Role" :options="[
                { value: 'admin', label: 'Admin' },
                { value: 'employee', label: 'Employee' },
              ]" placeholder="Enter job role"
                :error="formErrors.role" />
              <BaseInput id="email" type="email" v-model="formData.email" label="Email Address"
                placeholder="employee@company.com" :error="formErrors.email" />
              <BaseSelect id="status" v-model="formData.status" label="Employment Status" :options="[
                { value: 'Active', label: '🟢 Active' },
                { value: 'On Leave', label: '🟡 On Leave' },
                { value: 'Inactive', label: '🔴 Inactive' }
              ]" />
              <BaseInput v-if="!isEditing" id="password" type="password" v-model="formData.password" label="Password"
                placeholder="Create a password" :error="formErrors.password" />
            </div>

            <div
              class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4 border-t border-gray-200">
              <button type="button" @click="emit('close')"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                Cancel
              </button>
              <button type="submit" :disabled="!isAdmin || saving"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isEditing" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
                {{ isEditing ? 'Update Employee' : 'Add Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
