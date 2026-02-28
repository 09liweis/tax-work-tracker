import { defineEventHandler, getQuery } from 'h3';
import { Corporation } from '../../models/corporation.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  try {
    const query = getQuery(event);

    // Get page and limit from query params with defaults
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;

    // Calculate skip value
    const skip = (page - 1) * limit;

    const [corps, total] = await Promise.all([
      Corporation.find().sort({ name: 1 }).skip(skip).limit(limit),
      Corporation.countDocuments(query)
    ]);
    
    return { 
      success: true, 
      corporations: corps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total
      }
    };
  } catch (error) {
    return { success: false, error };
  }
});