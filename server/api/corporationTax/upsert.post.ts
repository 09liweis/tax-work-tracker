import { defineEventHandler, readBody } from 'h3';
import { CorporationTax } from '../../models/corporationTax.schema';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const { id, ...data } = body as any;
  data.lts = new Date();

  try {
    if (id) {
      const updated = await CorporationTax.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return { success: false, error: 'Task not found' };
      return { success: true, corporationTax: updated };
    }

    const record = new CorporationTax({ ...data, ts: new Date() });
    await record.save();
    return { success: true, corporationTax: record };
  } catch (error) {
    return { success: false, error };
  }
});
