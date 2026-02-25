import { defineEventHandler } from 'h3';
import { verifyToken } from '../../utils/jwt';
import { User } from '../../models/user.schema';
import { Client } from '../../models/client.schema';
import { Corporation } from '../../models/corporation.schema';

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
    // Get all statistics in parallel
    const [totalUsers, totalClients, totalCorporations] = await Promise.all([
      User.countDocuments(),
      Client.countDocuments(),
      Corporation.countDocuments()
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        adminUsers: 0, // Will be calculated on frontend
        regularUsers: 0, // Will be calculated on frontend
        activeUsers: 0, // Will be calculated on frontend
        inactiveUsers: 0, // Will be calculated on frontend
        totalClients,
        totalCorporations,
        totalTasks: 0 // Placeholder for future task tracking
      }
    };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to fetch admin statistics' };
  }
});
