import {PayrollService} from '../../models/payrollService.schema'

export default defineEventHandler(async (event) => {
  try {
    const services = await PayrollService.find().sort({ name: 1 })

    return {
      success: true,
      services
    }
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch payroll services'
    })
  }
})
