import { defineEventHandler, getQuery } from 'h3';
import { PersonalTax } from '../../models/personalTax.schema';
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
  if (query.clientId) filter.clientId = query.clientId;

  try {
    const personalTaxes = await PersonalTax.find(filter).sort({ ts: -1 });
    return { success: true, personalTaxes };
  } catch (error) {
    return { success: false, error };
  }
});
