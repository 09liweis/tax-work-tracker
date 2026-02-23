import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded?.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const { email, password, name, role, status } = body;

  // Basic validation - at least one field must be provided
  if (!email && !password && !name && !role && !status) {
    return { success: false, error: 'At least one field must be provided for update' };
  }

  if (password && password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const data = { email, password, name, role, status }

  try {
    const userId = event.context.params?.id;

    const user = await User.findById(userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await User.updateOne({_id:userId},data);
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
});
