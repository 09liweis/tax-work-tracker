<script setup>
import { ref, watch } from 'vue'
import { apiPost } from '~/utils/api'
import { STATUS_OPTIONS, MARITAL_STATUS_OPTIONS, GENDER_OPTIONS } from '~/components/utils/formOptions'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  client: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const isEditing = ref(props.isEditing)
const currentClient = ref({
  id: null,
  name: '',
  dob: '',
  sin: '',
  telephone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  maritalStatus: '',
  gender: ''
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    isEditing.value = props.isEditing
    if (props.client) {
      currentClient.value = { ...props.client, id: props.client.id || props.client._id }
      if (!currentClient.value.address) currentClient.value.address = ''
    } else {
      currentClient.value = {
        id: null,
        name: '',
        dob: '',
        sin: '',
        telephone: '',
        email: '',
        address: '',
        city: '',
        province: '',
        maritalStatus: '',
        gender: ''
      }
    }
  }
})

const saveClient = async () => {
  try {
    const payload = { ...currentClient.value }
    const res = await apiPost('/api/clients/upsert', payload)
    if (!res.success) throw new Error(res.error || 'Save failed')

    const saved = { ...res.client, id: res.client._id || res.client.id }
    emit('saved', saved)
    emit('close')
  } catch (err) {
    alert(err?.message || 'Error saving client')
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Edit Client' : 'Add New Client' }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ isEditing ? 'Update client information' : 'Enter client details' }}</p>
      </div>
      <form @submit.prevent="saveClient" class="px-6 py-6">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input id="name" v-model="currentClient.name" type="text" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
              placeholder="Enter client's full name">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="dob" class="block text-sm font-semibold text-gray-700 mb-2">DOB</label>
              <input id="dob" v-model="currentClient.dob" type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="sin" class="block text-sm font-semibold text-gray-700 mb-2">SIN</label>
              <input id="sin" v-model="currentClient.sin" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="SIN">
            </div>
          </div>

          <div>
            <label for="telephone" class="block text-sm font-semibold text-gray-700 mb-2">Telephone No.</label>
            <input id="telephone" v-model="currentClient.telephone" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., +1 555-555-5555">
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input id="email" v-model="currentClient.email" type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="client@example.com">
          </div>

          <div>
            <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input id="address" v-model="currentClient.address" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Street address, PO box, etc.">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input id="city" v-model="currentClient.city" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="province" class="block text-sm font-semibold text-gray-700 mb-2">Province</label>
              <input id="province" v-model="currentClient.province" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="maritalStatus" class="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
              <select id="maritalStatus" v-model="currentClient.maritalStatus"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select</option>
                <option v-for="option in MARITAL_STATUS_OPTIONS" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div>
              <label for="gender" class="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select id="gender" v-model="currentClient.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select</option>
                <option v-for="option in GENDER_OPTIONS" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <Button variant="outline" @click="closeModal">Cancel</Button>
          <Button variant="primary" type="submit">{{ isEditing ? 'Update Client' : 'Add Client' }}</Button>
        </div>
      </form>
    </div>
  </div>
</template>
