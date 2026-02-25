import { defineEventHandler } from 'h3';
import { verifyToken } from '../../utils/jwt';
import { PersonalTaxService } from '../../models/personalTaxService.schema';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await verifyToken(token);
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }

  try {
    const services = await PersonalTaxService.find().sort({ name: 1 });
    return { success: true, services };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to fetch personal tax services' };
  }
});
