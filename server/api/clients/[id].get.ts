import { defineEventHandler } from 'h3';
import { Client } from '../../models/client.schema';
import { Corporation } from '../../models/corporation.schema';
import { PersonalTax } from '../../models/personalTax.schema';
import { verifyToken } from '~~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const id = event.context.params?.id;

  try {
    const client = await Client.findById(id);
    const relatives = await Client.find({ clientId: id });
    const corporations = await Corporation.find({ clientId: id });
    const personalTaxes = await PersonalTax.find({ clientId: id });
    if (!client) return { success: false, error: 'Client not found' };
    return { success: true, client, relatives, corporations, personalTaxes };
  } catch (error) {
    return { success: false, error: 'Invalid client ID' };
  }
});