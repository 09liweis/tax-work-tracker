<script setup>
import BaseInput from '~/components/form/BaseInput.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  service: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  name: '',
  price: ''
})

const isEditing = computed(() => !!props.service)

watch(() => props.show, (newVal) => {
  if (newVal && props.service) {
    formData.value = {
      name: props.service.name || '',
      price: props.service.price || ''
    }
  } else if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    price: ''
  }
}

const handleSubmit = async () => {
  try {
    const payload = {
      name: formData.value.name,
      price: parseFloat(formData.value.price)
    }

    emit('save', payload)
    resetForm()
  } catch (error) {
    console.error('Error submitting payroll service:', error)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-slate-900/75 transition-opacity" @click="emit('close')"></div>
          </Transition>

          <Transition
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg font-semibold leading-6 text-slate-900" id="modal-title">
                      {{ isEditing ? 'Edit Payroll Service' : 'Add Payroll Service' }}
                    </h3>
                    <div class="mt-4 space-y-4">
                      <BaseInput
                        v-model="formData.name"
                        label="Service Name *"
                        id="name"
                        placeholder="e.g., Tax Filing"
                      />

                      <BaseInput
                        v-model="formData.price"
                        label="Price ($) *"
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button type="button" @click="handleSubmit" :disabled="!formData.name || !formData.price" variant="blue" class="w-full sm:w-auto sm:ml-3">
                  {{ isEditing ? 'Update' : 'Create' }}
                </Button>
                <Button type="button" @click="emit('close')" variant="outline" class="w-full sm:w-auto sm:mt-0 mt-3">Cancel</Button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
