import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { success, data, error } = loginSchema.safeParse(body);

  if (!success) {
    return { success: false, error: error.issues };
  }

  const user = await User.findOne({ email: data.email });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  return { success: true, token };
});
