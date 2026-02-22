import { defineEventHandler } from 'h3';
import { Client } from '../../models/client.schema';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const id = event.context.params?.id;

  try {
    const client = await Client.findById(id);
    if (!client) return { success: false, error: 'Client not found' };
    return { success: true, client };
  } catch (error) {
    return { success: false, error: 'Invalid client ID' };
  }
});