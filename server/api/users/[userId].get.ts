import {PersonalTax} from '../../models/personalTax.schema';
import {CorporationTax} from '../../models/corporationTax.schema';
import {CorporationPayroll} from '../../models/corporationPayroll.schema';
import {User} from '../../models/user.schema';

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;

  if (!userId) {
    return {
      success: false,
      error: 'User ID is required'
    };
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

    // Fetch personal tax records where caseWorker matches userId
    const personalTaxes = await PersonalTax.find({ caseWorker: userId });

    // Fetch corporation tax records where caseWorkerId matches userId
    const corporationTaxes = await CorporationTax.find({ caseWorkerId: userId });

    // Fetch corporation payroll records where caseWorkerId matches userId
    const corporationPayrolls = await CorporationPayroll.find({ caseWorkerId: userId });

    // Calculate total payments
    let totalPayment = 0;

    // Sum payments from personal taxes
    personalTaxes.forEach((tax) => {
      if (tax.payment && tax.payment > 0) {
        totalPayment += tax.payment;
      }
    });

    // Sum payments from corporation taxes
    corporationTaxes.forEach((tax) => {
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
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to fetch user details'
    };
  }
});
