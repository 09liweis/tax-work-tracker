<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  editing: Boolean,
  corporation: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["close", "save"])

// local state mirrors props.corporation or defaults for new record
const defaultCorp = () => ({
  id: null,
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
  emit('save', { ...currentCorporation })
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
                <label for="corpName" class="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input id="corpName" v-model="currentCorporation.name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter company name" required>
              </div>
              <div>
                <label for="industry" class="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                <input id="industry" v-model="currentCorporation.industry" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Technology">
              </div>
              <div>
                <label for="corpStatus" class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select id="corpStatus" v-model="currentCorporation.status" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label for="incorporatedDate" class="block text-sm font-semibold text-gray-700 mb-2">Incorporated Date</label>
                <input id="incorporatedDate" v-model="currentCorporation.incorporatedDate" type="date" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="endingPeriod" class="block text-sm font-semibold text-gray-700 mb-2">Year End</label>
                <input id="endingPeriod" v-model="currentCorporation.endingPeriod" type="date" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
          </div>

          <!-- Step 2: Tax & Account Details -->
          <div v-if="step === 2" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="bnNumber" class="block text-sm font-semibold text-gray-700 mb-2">BN Number</label>
                <input id="bnNumber" v-model="currentCorporation.bnNumber" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123456789">
              </div>
              <div>
                <label for="federalNo" class="block text-sm font-semibold text-gray-700 mb-2">Federal No.</label>
                <input id="federalNo" v-model="currentCorporation.federalNo" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="FED123456">
              </div>
              <div>
                <label for="provincialNo" class="block text-sm font-semibold text-gray-700 mb-2">Provincial No.</label>
                <input id="provincialNo" v-model="currentCorporation.provincialNo" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="PROV123456">
              </div>
              <div>
                <label for="wsibNo" class="block text-sm font-semibold text-gray-700 mb-2">WSIB No.</label>
                <input id="wsibNo" v-model="currentCorporation.wsibNo" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="WSIB123456">
              </div>
              <div>
                <label for="federalKey" class="block text-sm font-semibold text-gray-700 mb-2">Federal Key</label>
                <input id="federalKey" v-model="currentCorporation.federalKey" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="FEDKEY123">
              </div>
              <div>
                <label for="companyKey" class="block text-sm font-semibold text-gray-700 mb-2">Company Key</label>
                <input id="companyKey" v-model="currentCorporation.companyKey" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="COMPKEY123">
              </div>
              <div>
                <label for="isedAccountId" class="block text-sm font-semibold text-gray-700 mb-2">ISED Account ID</label>
                <input id="isedAccountId" v-model="currentCorporation.isedAccountId" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ISED123">
              </div>
              <div>
                <label for="isedPassword" class="block text-sm font-semibold text-gray-700 mb-2">ISED Password</label>
                <input id="isedPassword" v-model="currentCorporation.isedPassword" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••">
              </div>
              <div>
                <label for="oneKeyId" class="block text-sm font-semibold text-gray-700 mb-2">One Key ID</label>
                <input id="oneKeyId" v-model="currentCorporation.oneKeyId" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ONEKEY123">
              </div>
              <div>
                <label for="onePassword" class="block text-sm font-semibold text-gray-700 mb-2">One Password</label>
                <input id="onePassword" v-model="currentCorporation.onePassword" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••">
              </div>
            </div>
          </div>

          <!-- Step 3: Contact Info -->
          <div v-if="step === 3" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="contact" class="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
                <input id="contact" v-model="currentCorporation.contact" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="primaryContact" class="block text-sm font-semibold text-gray-700 mb-2">Primary Contact</label>
                <input id="primaryContact" v-model="currentCorporation.primaryContact" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus;border-blue-500">
              </div>
              <div>
                <label for="mainPhone" class="block text-sm font-semibold text-gray-700 mb-2">Main Phone</label>
                <input id="mainPhone" v-model="currentCorporation.mainPhone" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus;border-blue-500">
              </div>
              <div>
                <label for="mainEmail" class="block text-sm font-semibold text-gray-700 mb-2">Main Email</label>
                <input id="mainEmail" v-model="currentCorporation.mainEmail" type="email" class="w-full px-4 py-3 border;border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus;border-blue-500">
              </div>
              <div>
                <label for="address" class="block text-sm;font-semibold text-gray-700 mb-2">Address</label>
                <textarea id="address" v-model="currentCorporation.address" class="w-full px-4 py-3;border;border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div class="sm:col-span-2">
                <label for="note" class="block text-sm;font-semibold text-gray-700 mb-2">Notes</label>
                <textarea id="note" v-model="currentCorporation.note" class="w-full px-4 py-3;border;border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
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
