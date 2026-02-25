type StatusType = 'tax' | 'payroll' | 'default';
type Status = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'active' | 'inactive' | 'archived';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type TaskType = 'corporate_tax_return' | 'annual_accounts' | 'vat_return' | 'paye_return' | 'self_assessment';
type Frequency = 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'annually';

const taxColors: Record<string, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'overdue': 'bg-red-100 text-red-800'
};

const payrollColors: Record<string, string> = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'archived': 'bg-gray-100 text-gray-600'
};

const defaultColors: Record<string, string> = {
  ...taxColors,
  ...payrollColors
};

const priorityColors: Record<string, string> = {
  'low': 'bg-gray-100 text-gray-600',
  'medium': 'bg-blue-100 text-blue-600',
  'high': 'bg-orange-100 text-orange-600',
  'urgent': 'bg-red-100 text-red-600'
};

const taskTypeIcons: Record<string, string> = {
  'corporate_tax_return': '🏢',
  'annual_accounts': '📊',
  'vat_return': '💰',
  'paye_return': '👥',
  'self_assessment': '📋'
};

const frequencyColors: Record<string, string> = {
  'weekly': 'bg-blue-50 text-blue-700',
  'bi_weekly': 'bg-purple-50 text-purple-700',
  'monthly': 'bg-indigo-50 text-indigo-700',
  'quarterly': 'bg-teal-50 text-teal-700',
  'annually': 'bg-amber-50 text-amber-700'
};

export function getStatusColor(status: string, type: StatusType = 'default'): string {
  const colors = type === 'tax' ? taxColors : type === 'payroll' ? payrollColors : defaultColors;
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  return priorityColors[priority] || 'bg-gray-100 text-gray-600';
}

export function getTaskTypeIcon(taskType: string): string {
  return taskTypeIcons[taskType] || '📄';
}

export function getFrequencyBadge(freq: string): string {
  return frequencyColors[freq] || 'bg-gray-50 text-gray-700';
}

export type { StatusType, Status, Priority, TaskType, Frequency };
