<script setup>
const props = defineProps({
  user: { type: Object, required: true },
  totalPayment: { type: Number, default: 0 }
})

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount)
}
</script>

<template>
  <div class="bg-white shadow rounded overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
      <h2 class="text-xl font-semibold text-white">{{ user.name }}</h2>
      <p class="text-indigo-100">{{ user.email }}</p>
    </div>
    <div class="px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p class="text-sm font-medium text-gray-500">Role</p>
          <p class="text-lg text-gray-900">{{ user.role }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Status</p>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium"
            :class="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ user.status }}
          </span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Payment</p>
          <p class="text-lg font-bold text-indigo-600">{{ formatCurrency(totalPayment) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
