import { defineEventHandler, readBody } from 'h3';
import { CorporationPayroll } from '../../models/corporationPayroll.schema';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) return { success: false, error: 'Unauthorized' };

  try {
    const decoded = await verifyToken(token);
    if (!decoded) return { success: false, error: 'Unauthorized' };
  } catch (err) {
    return { success: false, error: 'Invalid token' };
  }

  const body = await readBody(event);
  const data: any = body;

  try {
    if (data._id) {
      const id = data._id;
      delete data._id;
      const updated = await CorporationPayroll.findByIdAndUpdate(id, data, { new: true });
      return { success: true, corporationPayroll: updated };
    } else {
      const record = new CorporationPayroll({ ...data, ts: new Date() });
      await record.save();

      // Handle creating rest of year payrolls
      if (data.createRestOfYear && data.year && data.payrollFrequency) {
        const frequencyMonths:{[key:string]:number} = {
          'monthly': 12,
          'bi_weekly': 26,
          'quarterly': 4,
          'weekly': 52,
          'annually': 1
        };
        const recordsToCreate = frequencyMonths[data.payrollFrequency] || 0;

        const baseDate = data.submittedDate ? new Date(data.submittedDate) : new Date();
        const baseMonth = baseDate.getMonth();
        const baseYear = baseDate.getFullYear();

        const additionalRecords = [];
        const recordsToSave = [];

        for (let i = 1; i <= recordsToCreate; i++) {
          const nextMonth = baseMonth + i;
          const nextYear = baseYear + Math.floor(nextMonth / 12);

          // Only create records within the same year
          if (nextYear > baseYear) break;

          const adjustedMonth = nextMonth % 12;
          const nextDate = new Date(nextYear, adjustedMonth, 1);
          const monthLabel = nextDate.toLocaleString('default', { month: 'long', year: 'numeric' });

          const restPayload = {
            ...data,
            submittedDate: nextDate.toISOString().substring(0, 10),
            completed: false,
            notes: `Auto-generated for ${monthLabel} (rest of year)`,
            ts: new Date()
          };

          delete restPayload._id;
          delete restPayload.createRestOfYear;

          recordsToSave.push(restPayload);
        }

        // Batch insert all records for better performance
        if (recordsToSave.length > 0) {
          const createdRecords = await CorporationPayroll.insertMany(recordsToSave);
          additionalRecords.push(...createdRecords);
        }

        return {
          success: true,
          corporationPayroll: record,
          additionalRecords: additionalRecords,
          message: `Created ${additionalRecords.length} additional payroll records`
        };
      }

      return { success: true, corporationPayroll: record };
    }
  } catch (error) {
    return { success: false, error };
  }
});
