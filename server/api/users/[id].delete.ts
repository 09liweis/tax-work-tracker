import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.schema';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    if (decoded.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }

  const { id } = event.context.params;
  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return { success: false, error: 'User not found' };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
});