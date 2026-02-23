import { defineEventHandler } from 'h3';
import { Corporation } from '../../models/corporation.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const id = event.context.params?.id;

  try {
    const corp = await Corporation.findById(id);
    if (!corp) return { success: false, error: 'Corporation not found' };
    return { success: true, corporation: corp };
  } catch (error) {
    return { success: false, error: 'Invalid corporation ID' };
  }
});