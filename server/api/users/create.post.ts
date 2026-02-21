import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
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
  const { success, data, error } = createUserSchema.safeParse(body);

  if (!success) {
    return { success: false, error: error.issues };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = new User({
    ...data,
    password: hashedPassword,
    role: data.role || 'user',
  });

  try {
    await user.save();
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
});
