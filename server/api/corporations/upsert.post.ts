import { defineEventHandler, readBody } from 'h3';
import { Corporation } from '../../models/corporation.schema';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const { id, ...data } = body as any;
  data.lts = new Date();

  try {
    if (id) {
      const updated = await Corporation.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return { success: false, error: 'Corporation not found' };
      return { success: true, corporation: updated };
    }

    const corp = new Corporation({ ...data, ts: new Date() });
    await corp.save();
    return { success: true, corporation: corp };
  } catch (error) {
    return { success: false, error };
  }
});