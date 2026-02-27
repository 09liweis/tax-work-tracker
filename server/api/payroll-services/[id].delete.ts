import {PayrollService} from '../../models/payrollService.schema'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const service = await PayrollService.findByIdAndDelete(id)

    if (!service) {
      return createError({
        statusCode: 404,
        statusMessage: 'Payroll service not found'
      })
    }

    return {
      success: true,
      message: 'Payroll service deleted successfully'
    }
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete payroll service'
    })
  }
})
