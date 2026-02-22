import { defineEventHandler } from 'h3';
import { CorporationTax } from '../../models/corporationTax.schema';
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
    const task = await CorporationTax.findById(id);
    if (!task) return { success: false, error: 'Task not found' };
    return { success: true, corporationTax: task };
  } catch (error) {
    return { success: false, error: 'Invalid ID' };
  }
});
