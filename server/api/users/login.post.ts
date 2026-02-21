import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  return { success: true, token };
});
