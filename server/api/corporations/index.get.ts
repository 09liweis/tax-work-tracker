import { defineEventHandler } from 'h3';
import { Corporation } from '../../models/corporation.schema';
import jwt from 'jsonwebtoken';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const clientId = event.node.req.url?.includes('clientId')
    ? new URL(event.node.req.url, 'http://fake').searchParams.get('clientId')
    : null;

  try {
    const query: any = {};
    if (clientId) query.clientId = clientId;
    const corps = await Corporation.find(query).sort({ name: 1 });
    return { success: true, corporations: corps };
  } catch (error) {
    return { success: false, error };
  }
});