import {PayrollService} from '../../models/payrollService.schema'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const service = await PayrollService.findByIdAndUpdate(
      id,
      {
        name: body.name,
        price: body.price,
        description: body.description || ''
      },
      { new: true, runValidators: true }
    )

    if (!service) {
      return createError({
        statusCode: 404,
        statusMessage: 'Payroll service not found'
      })
    }

    return {
      success: true,
      service
    }
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update payroll service'
    })
  }
})
