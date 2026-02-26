import { PersonalTax } from '../../models/personalTax.schema';
import { CorporationTax } from '../../models/corporationTax.schema';
import { CorporationPayroll } from '../../models/corporationPayroll.schema';
import { User } from '../../models/user.schema';

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;

  if (!userId) {
    return {
      success: false,
      error: 'User ID is required'
    };
  }

  // Get optional date range filters from query parameters
  const query = getQuery(event);
  const startDate = query.startDate ? new Date(query.startDate as string) : null;
  const endDate = query.endDate ? new Date(query.endDate as string) : null;

  // Adjust end date to include the entire day
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Build query filters for date range
    const buildDateFilter = () => {
      const filter: any = {};
      if (startDate || endDate) {
        filter.ts = {};
        if (startDate) filter.ts.$gte = startDate;
        if (endDate) filter.ts.$lte = endDate;
      }
      return filter;
    };

    const dateFilter = buildDateFilter();

    // Fetch personal tax records where caseWorker matches userId
    const personalTaxesQuery = { caseWorker: userId };
    if (Object.keys(dateFilter).length > 0) {
      Object.assign(personalTaxesQuery, dateFilter);
    }
    const personalTaxes = await PersonalTax.find(personalTaxesQuery);

    // Fetch corporation tax records where caseWorkerId matches userId
    const corporationTaxesQuery = { caseWorkerId: userId };
    if (Object.keys(dateFilter).length > 0) {
      Object.assign(corporationTaxesQuery, dateFilter);
    }
    const corporationTaxes = await CorporationTax.find(corporationTaxesQuery);

    // Fetch corporation payroll records where caseWorkerId matches userId
    const corporationPayrollsQuery = { caseWorkerId: userId };
    if (Object.keys(dateFilter).length > 0) {
      Object.assign(corporationPayrollsQuery, dateFilter);
    }
    const corporationPayrolls = await CorporationPayroll.find(corporationPayrollsQuery);

    // Calculate total payments
    let totalPayment = 0;

    // Sum payments from personal taxes
    personalTaxes.forEach((tax: any) => {
      if (tax.payment && tax.payment > 0) {
        totalPayment += tax.payment;
      }
    });

    // Sum payments from corporation taxes
    corporationTaxes.forEach((tax: any) => {
      if (tax.payment && tax.payment > 0) {
        totalPayment += tax.payment;
      }
    });

    // Note: CorporationPayroll doesn't have a payment field, so we skip it
    // If you need to include payroll-related payments, you would add that logic here

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      personalTaxes,
      corporationTaxes,
      corporationPayrolls,
      totalPayment,
      stats: {
        personalTaxCount: personalTaxes.length,
        corporationTaxCount: corporationTaxes.length,
        payrollCount: corporationPayrolls.length
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to fetch user details'
    };
  }
});
