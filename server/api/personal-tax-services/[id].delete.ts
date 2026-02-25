import { defineEventHandler } from 'h3';
import { verifyToken } from '../../utils/jwt';
import { PersonalTaxService } from '../../models/personalTaxService.schema';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }

  try {
    const id = getRouterParam(event, 'id');
    const service = await PersonalTaxService.findByIdAndDelete(id);

    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    return { success: true, message: 'Service deleted successfully' };
  } catch (err:any) {
    return { success: false, error: err.message || 'Failed to delete personal tax service' };
  }
});
