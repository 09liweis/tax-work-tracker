<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Corporations - Tax Work Tracker',
  meta: [
    { name: 'description', content: 'Handle corporate accounts and business clients in the tax work tracker.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Sample corporation data
const corporations = ref([
  {
    id: 1,
    name: 'TechCorp Inc.',
    status: 'Active',
    incorporatedDate: '2015-01-01',
    bnNumber: '123456789',
    federalNo: 'FED123456',
    isedAccountId: 'ISED123',
    isedPassword: 'password123',
    federalKey: 'FEDKEY123',
    provincialNo: 'PROV123456',
    companyKey: 'COMPKEY123',
    endingPeriod: '2024-12-31',
    contact: 'John Doe',
    sinNumber: '123-456-789',
    primaryContact: 'Jane Smith',
    mainPhone: '(555) 123-4567',
    industry: 'Technology',
    mainEmail: 'info@techcorp.com',
    oneKeyId: 'ONEKEY123',
    onePassword: 'onepass123',
    otherContactPerson: 'Mike Johnson',
    phone: '(555) 987-6543',
    wsibNo: 'WSIB123456',
    accessCode: 'ACCESS123',
    address: '123 Tech Blvd, Silicon Valley, CA',
    note: 'Growing tech company, specializes in AI solutions.'
  }
  // Add more sample corporations as needed
])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCorporation = ref({
  id: null,
  name: '',
  status: '',
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

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  currentCorporation.value = {
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
  }
  step.value = 1
  isModalOpen.value = true
}

const openEditModal = (corp) => {
  isEditing.value = true
  currentCorporation.value = { ...corp }
  step.value = 1
  isModalOpen.value = true
}

const step = ref(1)
const maxStep = 3

const nextStep = () => {
  if (step.value < maxStep) step.value++
}
const prevStep = () => {
  if (step.value > 1) step.value--
}

const saveCorporation = () => {
  if (isEditing.value) {
    const index = corporations.value.findIndex(c => c.id === currentCorporation.value.id)
    corporations.value[index] = { ...currentCorporation.value }
  } else {
    const newId = Math.max(...corporations.value.map(c => c.id)) + 1
    corporations.value.push({ ...currentCorporation.value, id: newId })
  }
  step.value = 1
  isModalOpen.value = false
}

const closeModal = () => {
  step.value = 1
  isModalOpen.value = false
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
            <h1 class="text-2xl font-bold text-gray-900">Corporations</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="openAddModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Corporation
            </button>
            <button
              @click="logout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Corporate Accounts</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your corporate clients and their tax information.</p>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="corp in corporations" :key="corp.id">
              <NuxtLink :to="`/dashboard/corporations/${corp.id}`" class="block hover:bg-gray-50">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">{{ corp.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ corp.name }}</div>
                        <div class="text-sm text-gray-500">{{ corp.industry }} • Tax ID: {{ corp.taxId }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="text-sm text-gray-900 font-medium">{{ corp.revenue }}</div>
                      <span
                        :class="corp.status === 'Active' ? 'bg-green-100 text-green-800' : corp.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ corp.status }}
                      </span>
                      <button @click.stop="openEditModal(corp)" class="text-indigo-600 hover:text-indigo-500 text-sm">Edit</button>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit Corporation' : 'Add New Corporation' }}</h2>
          <p class="text-sm text-blue-100 mt-1">{{ isEditing ? 'Update corporation information' : 'Enter corporation details' }}</p>
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
          <form @submit.prevent="saveCorporation">
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
                  <label for="accessCode" class="block text-sm font-semibold text-gray-700 mb-2">Access Code</label>
                  <input id="accessCode" v-model="currentCorporation.accessCode" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ACCESS123">
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
                  <label for="oneKeyId" class="block text-sm font-semibold text-gray-700 mb-2">ONE KEY ID</label>
                  <input id="oneKeyId" v-model="currentCorporation.oneKeyId" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ONEKEY123">
                </div>
                <div>
                  <label for="onePassword" class="block text-sm font-semibold text-gray-700 mb-2">ONE KEY Password</label>
                  <input id="onePassword" v-model="currentCorporation.onePassword" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••">
                </div>
              </div>
            </div>
            <!-- Step 3: Contact Information -->
            <div v-if="step === 3" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="primaryContact" class="block text-sm font-semibold text-gray-700 mb-2">Primary Contact Name</label>
                  <input id="primaryContact" v-model="currentCorporation.primaryContact" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe">
                </div>
                <div>
                  <label for="contact" class="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                  <input id="contact" v-model="currentCorporation.contact" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Jane Smith">
                </div>
                <div>
                  <label for="mainPhone" class="block text-sm font-semibold text-gray-700 mb-2">Main Phone</label>
                  <input id="mainPhone" v-model="currentCorporation.mainPhone" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="(555) 123-4567">
                </div>
                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Alternate Phone</label>
                  <input id="phone" v-model="currentCorporation.phone" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="(555) 987-6543">
                </div>
                <div class="sm:col-span-2">
                  <label for="mainEmail" class="block text-sm font-semibold text-gray-700 mb-2">Main Email</label>
                  <input id="mainEmail" v-model="currentCorporation.mainEmail" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="contact@company.com">
                </div>
                <div>
                  <label for="otherContactPerson" class="block text-sm font-semibold text-gray-700 mb-2">Other Contact Person</label>
                  <input id="otherContactPerson" v-model="currentCorporation.otherContactPerson" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Mike Johnson">
                </div>
                <div>
                  <label for="sinNumber" class="block text-sm font-semibold text-gray-700 mb-2">SIN Number</label>
                  <input id="sinNumber" v-model="currentCorporation.sinNumber" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123-456-789">
                </div>
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input id="address" v-model="currentCorporation.address" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123 Business St, City, Province">
                </div>
                <div class="sm:col-span-2">
                  <label for="note" class="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea id="note" v-model="currentCorporation.note" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Additional notes or information..."></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <div class="flex space-x-3">
            <button
              v-if="step > 1"
              type="button"
              @click="prevStep"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Previous
            </button>
            <button
              v-if="step < maxStep"
              type="button"
              @click="nextStep"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            >
              Next Step
            </button>
            <button
              v-if="step === maxStep"
              type="button"
              @click="saveCorporation"
              class="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
            >
              {{ isEditing ? 'Update Corporation' : 'Add Corporation' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>