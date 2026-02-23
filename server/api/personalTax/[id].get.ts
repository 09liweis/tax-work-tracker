import { defineEventHandler, getQuery } from 'h3';
import { PersonalTax } from '../../models/personalTax.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    await verifyToken(token)
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const query = getQuery(event) as any;
  const { id } = query;
  try {
    const task = await PersonalTax.findById(id);
    if (!task) return { success: false, error: 'Task not found' };
    return { success: true, personalTax: task };
  } catch (error) {
    return { success: false, error };
  }
});
