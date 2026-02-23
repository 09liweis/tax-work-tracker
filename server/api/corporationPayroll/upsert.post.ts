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

  const body = await useBody(event);
  const data: any = body;

  try {
    if (data.id) {
      const id = data.id;
      delete data.id;
      const updated = await CorporationPayroll.findByIdAndUpdate(id, data, { new: true });
      return { success: true, corporationPayroll: updated };
    } else {
      const record = new CorporationPayroll({ ...data, ts: new Date() });
      await record.save();
      return { success: true, corporationPayroll: record };
    }
  } catch (error) {
    return { success: false, error };
  }
});
