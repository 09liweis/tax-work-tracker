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

  const corpId = event.node.req.url?.includes('corpId')
    ? new URL(event.node.req.url, 'http://fake').searchParams.get('corpId')
    : null;

  try {
    const query: any = {};
    if (corpId) query.corpId = corpId;
    const tasks = await CorporationTax.find(query).sort({ dueDate: -1 });
    return { success: true, corporationTaxes: tasks };
  } catch (error) {
    return { success: false, error };
  }
});
