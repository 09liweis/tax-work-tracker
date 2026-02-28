import { defineEventHandler, getQuery } from 'h3';
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

  const query = getQuery(event) as any;
  const filter: any = {};
  if (query.corpId) filter.corpId = query.corpId;
  if (query.year) filter.yearEnding = query.year;

  try {
    const tasks = await CorporationTax.find(filter).sort({ dueDate: -1 });
    return { success: true, corporationTaxes: tasks };
  } catch (error) {
    return { success: false, error };
  }
});
