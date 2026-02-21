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

  try {
    const clients = await Client.find().sort({ name: 1 });
    return { success: true, clients };
  } catch (error) {
    return { success: false, error };
  }
});