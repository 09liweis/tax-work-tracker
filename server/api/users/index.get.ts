import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.schema';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }

  try {
    const users = await User.find().select('-password');
    return { success: true, users };
  } catch (err) {
    return { success: false, error: err };
  }
});
