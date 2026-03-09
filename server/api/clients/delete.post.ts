import { defineEventHandler, readBody } from 'h3';
import { Client } from '../../models/client.schema';
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
    return { success: false, error: 'Client ID is required' };
  }

  try {
    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: 'Client not found' };
    }
    return { success: true, message: 'Client deleted successfully' };
  } catch (error) {
    return { success: false, error };
  }
});
