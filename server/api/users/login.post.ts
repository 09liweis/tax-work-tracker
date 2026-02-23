import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getLoginToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // Basic validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const data = { email, password };

  const user = await User.findOne({ email: data.email });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = await getLoginToken({userId: user._id});

  return { success: true, token, role: user.role };
});
