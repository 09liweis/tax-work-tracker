import { defineEventHandler, getQuery } from 'h3';
import { Client } from '../../models/client.schema';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    await verifyToken(token);
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

    // Build filter from query params
    const filter: any = {};

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.email) {
      filter.email = { $regex: query.email, $options: 'i' };
    }

    if (query.sin) {
      filter.sin = { $regex: query.sin, $options: 'i' };
    }

    if (query.dob) {
      filter.dob = new Date(query.dob as string);
    }

    // Get total count with filter
    const total = await Client.countDocuments(filter);

    // Get paginated clients with filter
    const clients = await Client.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch clients' };
  }
});