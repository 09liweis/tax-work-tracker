<script setup>
const props = defineProps({
  personalTaxes: { type: Array, default: () => [] },
  corporationTaxes: { type: Array, default: () => [] },
  stats: { type: Object, required: true }
})

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount)
}

const calculatePersonalTaxTotal = () => {
  if (!props.personalTaxes) return 0
  return props.personalTaxes.reduce((sum, tax) => sum + (tax.payment || 0), 0)
}

const calculateCorporationTaxTotal = () => {
  if (!props.corporationTaxes) return 0
  return props.corporationTaxes.reduce((sum, tax) => sum + (tax.payment || 0), 0)
}
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 rounded p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Personal Tax Payments</h3>
        <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(calculatePersonalTaxTotal()) }}</p>
        <p class="text-sm text-gray-500">{{ stats.personalTaxCount }} records</p>
      </div>
      <div class="bg-gray-50 rounded p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Corporation Tax Payments</h3>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(calculateCorporationTaxTotal()) }}</p>
        <p class="text-sm text-gray-500">{{ stats.corporationTaxCount }} records</p>
      </div>
    </div>
  </div>
</template>
