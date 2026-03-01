<script setup>
import { getStatusColor } from '~/components/utils/statusHelpers'
import { formatDate } from '~/utils/dateFormat'

const props = defineProps({
  corporationPayrolls: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="corporationPayrolls.length === 0" class="text-center py-8 text-gray-500">
      No payroll records found
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corporation ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payroll Frequency</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payroll in corporationPayrolls" :key="payroll._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payroll.corpId || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payroll.year || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700">
                {{ payroll.payrollFrequency || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(payroll.payrollStatus, 'payroll')">
                {{ payroll.payrollStatus || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ payroll.submittedDate ? formatDate(payroll.submittedDate) : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
