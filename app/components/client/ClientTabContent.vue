<script setup>
import PersonalTaxSection from '~/components/PersonalTaxSection.vue'
import CorporationList from '~/components/corporation/CorporationList.vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  personalTaxes: {
    type: Array,
    default: () => []
  },
  personalTaxesLoading: {
    type: Boolean,
    default: false
  },
  personalTaxesError: {
    type: String,
    default: ''
  },
  filterYear: {
    type: String,
    default: ''
  },
  corporations: {
    type: Array,
    default: () => []
  },
  corporationsLoading: {
    type: Boolean,
    default: false
  },
  corporationsError: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['new-personal-tax', 'edit-personal-tax', 'filter-personal-tax', 'add-corporation', 'edit-corporation'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Personal Tax Tab Content -->
      <PersonalTaxSection
        v-if="activeTab === 'personal-tax'"
        :personal-taxes="personalTaxes"
        :loading="personalTaxesLoading"
        :error="personalTaxesError"
        :selected-year="filterYear"
        @new="emit('new-personal-tax')"
        @edit="emit('edit-personal-tax', $event)"
        @filter="emit('filter-personal-tax', $event)"
      />

    <!-- Corporations Tab Content -->
    <div v-if="activeTab === 'corporations'">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Corporations
          </h2>
          <Button @click="emit('add-corporation')" variant="info">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Corporation
          </Button>
        </div>
      </div>

      <div v-if="corporationsLoading" class="px-6 py-12 text-center">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-gray-600">Loading corporations</p>
      </div>

      <div v-else-if="corporationsError" class="px-6 py-6">
        <div class="rounded-md bg-red-50 p-4 text-sm text-red-700">{{ corporationsError }}</div>
      </div>

      <div v-else-if="corporations.length === 0" class="px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No corporations</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by adding a corporation.</p>
      </div>

      <div v-else>
        <CorporationList :corporations="corporations" />
      </div>
    </div>
  </div>
</template>
