<script setup>
import CorporationTaxSection from './CorporationTaxSection.vue';
import CorporationPayrollSection from './CorporationPayrollSection.vue';
const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  corpId: {
    type: String,
    required: true
  },
  taxTasks: {
    type: Array,
    default: () => []
  },
  taxLoading: {
    type: Boolean,
    default: false
  },
  taxError: {
    type: String,
    default: ''
  },
  payrollRecords: {
    type: Array,
    default: () => []
  },
  payrollLoading: {
    type: Boolean,
    default: false
  },
  payrollError: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['new-tax', 'edit-tax', 'new-payroll', 'edit-payroll', 'delete-payroll'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Tax Tab Content -->
    <div v-if="activeTab === 'tax'">
      <CorporationTaxSection
        :tasks="taxTasks"
        :loading="taxLoading"
        :error="taxError"
        @new="emit('new-tax')"
        @edit="emit('edit-tax', $event)"
      />
    </div>

    <!-- Payroll Tab Content -->
    <div v-if="activeTab === 'payroll'">
      <CorporationPayrollSection
        :tasks="payrollRecords"
        :loading="payrollLoading"
        :error="payrollError"
        @new="emit('new-payroll')"
        @edit="emit('edit-payroll', $event)"
        @delete="emit('delete-payroll', $event)"
      />
    </div>
  </div>
</template>
