export interface FormOption {
  value: string
  label: string
}

export const STATUS_OPTIONS: FormOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' }
]

export const PRIORITY_OPTIONS: FormOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

export const DOC_STATUS_OPTIONS: FormOption[] = [
  { value: 'received', label: 'Received' },
  { value: 'pending', label: 'Pending' },
  { value: 'not_required', label: 'Not Required' },
  { value: 'incomplete', label: 'Incomplete' }
]

export const PAYROLL_STATUS_OPTIONS: FormOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' }
]

export const FREQUENCY_OPTIONS: FormOption[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
]

export const TAX_SLIPS_STATUS_OPTIONS: FormOption[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'submitted', label: 'Submitted' }
]

export const SUBMIT_METHOD_OPTIONS: FormOption[] = [
  { value: 'online', label: 'Online' },
  { value: 'paper', label: 'Paper' },
  { value: 'software', label: 'Software' },
  { value: 'efile', label: 'E-File' }
]

export const FILLING_METHOD_OPTIONS: FormOption[] = [
  { value: 'online', label: 'Online' },
  { value: 'paper', label: 'Paper' },
  { value: 'mail', label: 'Mail' }
]

export const CORPORATION_STATUS_OPTIONS: FormOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'inactive', label: 'Inactive' }
]

export const EMPLOYEE_STATUS_OPTIONS: FormOption[] = [
  { value: 'active', label: '🟢 Active' },
  { value: 'on_leave', label: '🟡 On Leave' },
  { value: 'inactive', label: '🔴 Inactive' }
]

export const EMPLOYEE_ROLE_OPTIONS: FormOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'employee', label: 'Employee' }
]

export const GENDER_OPTIONS: FormOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

export const MARITAL_STATUS_OPTIONS: FormOption[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' }
]

export const CLIENT_STATUS_OPTIONS: FormOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' }
]
