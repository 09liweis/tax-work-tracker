import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.schema';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded._id).select('-password');
    if (!user) return { success: false, error: 'User not found' };
    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }
});