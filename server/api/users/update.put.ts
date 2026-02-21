import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().optional(),
  role: z.string().optional(),
});

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
  const { success, data, error } = updateUserSchema.safeParse(body);

  if (!success) {
    return { success: false, error: error.issues };
  }

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
