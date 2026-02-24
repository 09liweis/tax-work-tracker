<script setup>
import { reactive, ref, watch } from 'vue'
import BaseInput from '~/components/form/BaseInput.vue'
import BaseTextarea from '~/components/form/BaseTextarea.vue'
import BaseSelect from '~/components/form/BaseSelect.vue'
import BasePasswordInput from '~/components/form/BasePasswordInput.vue'
import { CORPORATION_STATUS_OPTIONS } from './utils/formOptions.js'

const props = defineProps({
  visible: Boolean,
  editing: Boolean,
  corporation: {
    type: Object,
    default: null
  },
  clientId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(["close", "save"])

// local state mirrors props.corporation or defaults for new record
const defaultCorp = () => ({
  id: null,
  clientId: props.clientId || null,
  name: '',
  status: 'Active',
  incorporatedDate: '',
  bnNumber: '',
  federalNo: '',
  isedAccountId: '',
  isedPassword: '',
  federalKey: '',
  provincialNo: '',
  companyKey: '',
  endingPeriod: '',
  contact: '',
  sinNumber: '',
  primaryContact: '',
  mainPhone: '',
  industry: '',
  mainEmail: '',
  oneKeyId: '',
  onePassword: '',
  otherContactPerson: '',
  phone: '',
  wsibNo: '',
  accessCode: '',
  address: '',
  note: ''
})

const currentCorporation = reactive(defaultCorp())
const step = ref(1)
const maxStep = 3

const resetForm = () => {
  Object.assign(currentCorporation, defaultCorp())
  step.value = 1
}

watch(
  () => props.corporation,
  (c) => {
    if (c) {
      Object.assign(currentCorporation, c)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// also watch clientId so new records pick it up
watch(
  () => props.clientId,
  (id) => {
    if (!props.corporation) {
      currentCorporation.clientId = id
    }
  }
)

// when the modal closes we should reset
watch(
  () => props.visible,
  (v) => {
    if (!v) {
      resetForm()
    }
  }
)

const nextStep = () => {
  if (step.value < maxStep) step.value++
}
const prevStep = () => {
  if (step.value > 1) step.value--
}

const save = () => {
  // include clientId if provided via prop
  const payload = { ...currentCorporation }
  if (props.clientId) payload.clientId = props.clientId
  emit('save', payload)
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 class="text-2xl font-bold text-white">{{ editing ? 'Edit Corporation' : 'Add New Corporation' }}</h2>
        <p class="text-sm text-blue-100 mt-1">{{ editing ? 'Update corporation information' : 'Enter corporation details' }}</p>
      </div>
      <!-- ensure clientId is included -->
      <input v-if="props.clientId" type="hidden" :value="props.clientId" />

      <!-- Step Indicator -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div v-for="stepNum in maxStep" :key="stepNum" class="flex items-center flex-1">
            <div class="flex items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                ]"
              >
                {{ stepNum }}
              </div>
              <div class="ml-2 hidden sm:block">
                <div
                  :class="[
                    'text-xs font-medium',
                    step >= stepNum ? 'text-blue-600' : 'text-gray-500'
                  ]"
                >
                  {{ stepNum === 1 ? 'Basic Info' : stepNum === 2 ? 'Tax Details' : 'Contact Info' }}
                </div>
              </div>
            </div>
            <div
              v-if="stepNum < maxStep"
              :class="[
                'flex-1 h-0.5 mx-2 transition-all duration-200',
                step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-6 py-6 overflow-y-auto max-h-[calc(90vh-280px)]">
        <form @submit.prevent="save">
          <!-- Step 1: Basic Information -->
          <div v-if="step === 1" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <BaseInput id="corpName" v-model="currentCorporation.name" label="Company Name *" placeholder="Enter company name" required />
              </div>
              <div>
                <BaseInput id="industry" v-model="currentCorporation.industry" label="Industry" placeholder="e.g., Technology" />
              </div>
              <div>
                <BaseSelect id="corpStatus" v-model="currentCorporation.status" label="Status" :options="CORPORATION_STATUS_OPTIONS" />
              </div>
              <div>
                <BaseInput id="incorporatedDate" v-model="currentCorporation.incorporatedDate" label="Incorporated Date" type="date" />
              </div>
              <div>
                <BaseInput id="endingPeriod" v-model="currentCorporation.endingPeriod" label="Year End" type="date" />
              </div>
            </div>
          </div>

          <!-- Step 2: Tax & Account Details -->
          <div v-if="step === 2" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <BaseInput id="bnNumber" v-model="currentCorporation.bnNumber" label="BN Number" placeholder="123456789" />
              </div>
              <div>
                <BaseInput id="federalNo" v-model="currentCorporation.federalNo" label="Federal No." placeholder="FED123456" />
              </div>
              <div>
                <BaseInput id="provincialNo" v-model="currentCorporation.provincialNo" label="Provincial No." placeholder="PROV123456" />
              </div>
              <div>
                <BaseInput id="wsibNo" v-model="currentCorporation.wsibNo" label="WSIB No." placeholder="WSIB123456" />
              </div>
              <div>
                <BaseInput id="federalKey" v-model="currentCorporation.federalKey" label="Federal Key" placeholder="FEDKEY123" />
              </div>
              <div>
                <BaseInput id="companyKey" v-model="currentCorporation.companyKey" label="Company Key" placeholder="COMPKEY123" />
              </div>
              <div>
                <BaseInput id="isedAccountId" v-model="currentCorporation.isedAccountId" label="ISED Account ID" placeholder="ISED123" />
              </div>
              <div>
                <BasePasswordInput id="isedPassword" v-model="currentCorporation.isedPassword" label="ISED Password" placeholder="••••••••" />
              </div>
              <div>
                <BaseInput id="oneKeyId" v-model="currentCorporation.oneKeyId" label="One Key ID" placeholder="ONEKEY123" />
              </div>
              <div>
                <BasePasswordInput id="onePassword" v-model="currentCorporation.onePassword" label="One Password" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <!-- Step 3: Contact Info -->
          <div v-if="step === 3" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <BaseInput id="contact" v-model="currentCorporation.contact" label="Contact Person" />
              </div>
              <div>
                <BaseInput id="primaryContact" v-model="currentCorporation.primaryContact" label="Primary Contact" />
              </div>
              <div>
                <BaseInput id="mainPhone" v-model="currentCorporation.mainPhone" label="Main Phone" />
              </div>
              <div>
                <BaseInput id="mainEmail" type="email" v-model="currentCorporation.mainEmail" label="Main Email" />
              </div>
              <div>
                <BaseTextarea id="address" v-model="currentCorporation.address" label="Address" />
              </div>
              <div class="sm:col-span-2">
                <BaseTextarea id="note" v-model="currentCorporation.note" label="Notes" />
              </div>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div class="mt-6 flex justify-between">
            <button type="button" @click="prevStep" :disabled="step === 1" class="px-4 py-2 bg-gray-300 text-gray-700 rounded">Previous</button>
            <div>
              <button v-if="step < maxStep" type="button" @click="nextStep" class="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
              <button v-else type="submit" class="px-4 py-2 bg-green-600 text-white rounded">{{ editing ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </form>
      </div>

      <!-- Close icon -->
      <button @click="$emit('close')" class="absolute top-2 right-2 text-white text-2xl leading-none">&times;</button>
    </div>
  </div>
</template>
