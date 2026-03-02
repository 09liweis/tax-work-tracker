import { defineEventHandler, readBody } from 'h3';
import { CorporationPayroll } from '../../models/corporationPayroll.schema';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
    if (!decoded) return { success: false, error: 'Unauthorized' };
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    return { success: false, error: 'Payroll ID is required' };
  }

  try {
    const deleted = await CorporationPayroll.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: 'Payroll record not found' };
    }
    return { success: true, message: 'Payroll record deleted successfully' };
  } catch (error) {
    return { success: false, error };
  }
});
