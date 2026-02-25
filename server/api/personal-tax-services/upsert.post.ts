import { defineEventHandler } from 'h3';
import { verifyToken } from '../../utils/jwt';
import { PersonalTaxService } from '../../models/personalTaxService.schema';

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
    const body = await readBody(event);

    const serviceData = {
      name: body.name,
      price: parseFloat(body.price),
      description: body.description || '',
      category: body.category || 'forms',
      status: body.status || 'Active',
      ts: new Date(),
      lts: new Date()
    };

    let service;
    if (body.id) {
      // Update existing service
      service = await PersonalTaxService.findByIdAndUpdate(
        body.id,
        serviceData,
        { new: true, runValidators: true }
      );
      if (!service) {
        return { success: false, error: 'Service not found' };
      }
    } else {
      // Create new service
      service = new PersonalTaxService(serviceData);
      await service.save();
    }

    return { success: true, service };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to save personal tax service' };
  }
});
