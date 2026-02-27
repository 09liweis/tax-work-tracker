import {PayrollService} from '../../models/payrollService.schema'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const service = await PayrollService.create({
      name: body.name,
      price: body.price,
      description: body.description || ''
    })

    return {
      success: true,
      service
    }
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create payroll service'
    })
  }
})
