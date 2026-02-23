import { defineEventHandler } from 'h3';
import { CorporationPayroll } from '../../models/corporationPayroll.schema';
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
    const records = await CorporationPayroll.find(query).sort({ year: -1 });
    return { success: true, corporationPayrolls: records };
  } catch (error) {
    return { success: false, error };
  }
});
