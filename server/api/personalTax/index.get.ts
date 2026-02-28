import { defineEventHandler, getQuery } from 'h3';
import { PersonalTax } from '../../models/personalTax.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const query = getQuery(event) as any;
  const filter: any = {};
  if (query.clientId) filter.clientId = query.clientId;
  if (query.year) filter.taxYear = query.year;

  try {
    const personalTaxes = await PersonalTax.find(filter).sort({ ts: -1 });
    return { success: true, personalTaxes };
  } catch (error) {
    return { success: false, error };
  }
});
