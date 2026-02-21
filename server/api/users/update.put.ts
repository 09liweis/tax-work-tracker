import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

  const body = await readBody(event);
  const { email, password, name, role } = body;

  // Basic validation - at least one field must be provided
  if (!email && !password && !name && !role) {
    return { success: false, error: 'At least one field must be provided for update' };
  }

  if (password && password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const data = { email, password, name, role }

  const { userId } = event.context.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);

    await user.save();
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
});
