<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Client Details - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'View detailed information about a tax client.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const clientId = route.params.clientId

import ClientInfoCard from '~/components/ClientInfoCard.vue'
import PersonalTaxSection from '~/components/PersonalTaxSection.vue'
import TaskModal from '~/components/TaskModal.vue'

const client = ref(null)
const isLoading = ref(true)
const fetchError = ref('')

// personal tax management
const personalTaxes = ref([])
const personalTaxesLoading = ref(false)
const personalTaxesError = ref('')

// modal state
const showTaskModal = ref(false)
const modalTask = ref(null)


const fetchClient = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load client')
    client.value = { ...res.client, id: res.client._id || res.client.id }
  } catch (err) {
    fetchError.value = err?.message || 'An error occurred while loading client'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchClient()
  await fetchPersonalTaxes()
})

const fetchPersonalTaxes = async () => {
  personalTaxesLoading.value = true
  personalTaxesError.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch(`/api/personalTax?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.success) throw new Error(res.error || 'Failed to load personal tax records')
    personalTaxes.value = res.personalTaxes || []
  } catch (err) {
    personalTaxesError.value = err?.message || 'An error occurred while loading personal taxes'
  } finally {
    personalTaxesLoading.value = false
  }
}

const openModal = () => {
  modalTask.value = null
  showTaskModal.value = true
}

const openEditModal = (task) => {
  modalTask.value = task
  showTaskModal.value = true
}

const closeModal = () => {
  showTaskModal.value = false
  modalTask.value = null
}

const handleSave = async () => {
  await fetchPersonalTaxes()
  closeModal()
}

</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <ClientInfoCard
      :client="client"
      :isLoading="isLoading"
      :error="fetchError"
      @retry="fetchClient"
    />

    <template v-if="client">
      <PersonalTaxSection
        :personalTaxes="personalTaxes"
        :loading="personalTaxesLoading"
        :error="personalTaxesError"
        @new="openModal"
        @edit="openEditModal"
      />
    </template>

    <TaskModal
      :visible="showTaskModal"
      :clientId="clientId"
      :task="modalTask"
      @close="closeModal"
      @saved="handleSave"
    />
  </div>
</template>