import { defineEventHandler, readBody } from 'h3';
import { Client } from '../../models/client.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const { id, ...data } = body as any;
  data.lts = new Date();

  try {
    if (id) {
      const updated = await Client.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return { success: false, error: 'Client not found' };
      return { success: true, client: updated };
    }

    const client = new Client({ ...data, ts: new Date() });
    await client.save();
    return { success: true, client };
  } catch (error) {
    return { success: false, error };
  }
});
