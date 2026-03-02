import { defineEventHandler } from 'h3';
import { User } from '../../models/user.schema';
import { getRefreshToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded._id).select('-password');
    if (!user) return { success: false, error: 'User not found' };

    const refreshToken = await getRefreshToken({ userId: user._id });
    return { success: true, user, refreshToken };
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }
});