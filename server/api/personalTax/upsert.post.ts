import { defineEventHandler, readBody } from 'h3';
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

  const body = await readBody(event);
  const { id, ...data } = body as any;
  data.lts = new Date();

  try {
    if (id) {
      const updated = await PersonalTax.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return { success: false, error: 'Task not found' };
      return { success: true, personalTax: updated };
    }

    const task = new PersonalTax({ ...data, ts: new Date() });
    await task.save();
    return { success: true, personalTax: task };
  } catch (error) {
    return { success: false, error };
  }
});
