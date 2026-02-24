export const getStatusColor = (status, type = 'default') => {
  const taxColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800'
  }

  const payrollColors = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'archived': 'bg-gray-100 text-gray-600'
  }

  const defaultColors = {
    ...taxColors,
    ...payrollColors
  }

  const colors = type === 'tax' ? taxColors : type === 'payroll' ? payrollColors : defaultColors
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getPriorityColor = (priority) => {
  const colors = {
    'low': 'bg-gray-100 text-gray-600',
    'medium': 'bg-blue-100 text-blue-600',
    'high': 'bg-orange-100 text-orange-600',
    'urgent': 'bg-red-100 text-red-600'
  }
  return colors[priority] || 'bg-gray-100 text-gray-600'
}

export const getTaskTypeIcon = (taskType) => {
  const icons = {
    'corporate_tax_return': '🏢',
    'annual_accounts': '📊',
    'vat_return': '💰',
    'paye_return': '👥',
    'self_assessment': '📋'
  }
  return icons[taskType] || '📄'
}

export const getFrequencyBadge = (freq) => {
  const colors = {
    'weekly': 'bg-blue-50 text-blue-700',
    'bi_weekly': 'bg-purple-50 text-purple-700',
    'monthly': 'bg-indigo-50 text-indigo-700',
    'quarterly': 'bg-teal-50 text-teal-700',
    'annually': 'bg-amber-50 text-amber-700'
  }
  return colors[freq] || 'bg-gray-50 text-gray-700'
}
