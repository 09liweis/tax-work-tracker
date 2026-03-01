<script setup>
import { getStatusColor, getPriorityColor, getTaskTypeIcon } from '~/components/utils/statusHelpers'
import { formatDate } from '~/utils/dateFormat'

const props = defineProps({
  corporationTaxes: { type: Array, default: () => [] }
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
  <div class="space-y-4">
    <div v-if="corporationTaxes.length === 0" class="text-center py-8 text-gray-500">
      No corporation tax records found
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Ending</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tax in corporationTaxes" :key="tax._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="mr-2">{{ getTaskTypeIcon(tax.taskType) }}</span>
              {{ tax.taskType || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ tax.taskDescription || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tax.yearEnding || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(tax.status, 'tax')">
                {{ tax.status || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getPriorityColor(tax.priority)">
                {{ tax.priority || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ tax.dueDate ? formatDate(tax.dueDate) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="tax.payment ? 'text-green-600' : 'text-gray-400'">
              {{ formatCurrency(tax.payment) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
