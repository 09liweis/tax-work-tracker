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

  const id = event.context.params?.id;
  if (!id) return { success: false, error: 'Missing id' };

  try {
    const record = await CorporationPayroll.findById(id);
    return { success: true, corporationPayroll: record };
  } catch (error) {
    return { success: false, error };
  }
});
