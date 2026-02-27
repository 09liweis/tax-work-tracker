/**
 * Standalone script to seed payroll services
 * Run with: node scripts/run-seed-payroll-services.js
 */

import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tax-work-tracker';
const DB_NAME = 'tax-work-tracker';

const servicesData = [
  { name: 'Payroll Service', price: 360.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll A/C Registration', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Bookkeeping Services (含报销）', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Payroll Service Package', price: 720.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll Calculation(/Person,/Time)', price: 20.00, ts: new Date(), lts: new Date() },
  { name: 'CRA Account Representatvie Services', price: 360.00, ts: new Date(), lts: new Date() },
  { name: 'Pay Stub', price: 15.00, ts: new Date(), lts: new Date() },
  { name: 'ROE', price: 80.00, ts: new Date(), lts: new Date() },
  { name: 'Employment Letter', price: 80.00, ts: new Date(), lts: new Date() },
  { name: 'T4/T4A/T5/NR4 Slips', price: 60.00, ts: new Date(), lts: new Date() },
  { name: 'WSIB A/C Registration', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'WSIB A/C Closure', price: 120.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll Calculation', price: 0, ts: new Date(), lts: new Date() },
  { name: 'T4 Amendment', price: 0, ts: new Date(), lts: new Date() },
  { name: 'WSIB Auditing Support', price: 300.00, ts: new Date(), lts: new Date() },
  { name: 'EI Application', price: 300.00, ts: new Date(), lts: new Date() },
  { name: 'To pay service', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Issued Invoice', price: 15.00, ts: new Date(), lts: new Date() },
  { name: 'Accounting Service Package', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'Service Fee in Nov', price: 150.00, ts: new Date(), lts: new Date() },
  { name: 'Service Fee in Dec', price: 150.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll Service Package 2023 06-2023 12', price: 300.00, ts: new Date(), lts: new Date() },
  { name: 'WSIB Service Package', price: 150.00, ts: new Date(), lts: new Date() },
  { name: 'Respond to CRA Calls', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Accounting Service Package in 2024', price: 300.00, ts: new Date(), lts: new Date() },
  { name: 'Calculation & Issued T4 Slips', price: 100, ts: new Date(), lts: new Date() },
  { name: 'Cancelled T4A in 2023', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll Calculation & PaySlip', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'Late filing penalty(CRA)', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'Payroll Remittance(CRA)', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Interest(CRA)', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Payroll Service Package in 2024-Biweekly', price: 600, ts: new Date(), lts: new Date() },
  { name: 'Payroll Service Package in 2024-Monthly', price: 600, ts: new Date(), lts: new Date() },
  { name: 'WSIB Service Package', price: 360, ts: new Date(), lts: new Date() },
  { name: 'Issue Termination File', price: 100, ts: new Date(), lts: new Date() },
  { name: 'Payroll Calculation', price: 15, ts: new Date(), lts: new Date() },
  { name: 'Personal Income Tax', price: 160, ts: new Date(), lts: new Date() },
  { name: 'Payroll Calculation', price: 150, ts: new Date(), lts: new Date() },
  { name: 'Corporation Income Return', price: 0, ts: new Date(), lts: new Date() },
  { name: 'HST Return', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Payroll Bookkeeping', price: 300, ts: new Date(), lts: new Date() },
  { name: 'Payroll Remittance Reconciliation with CRA', price: 100, ts: new Date(), lts: new Date() },
  { name: 'Interview with CRA Officer', price: 300, ts: new Date(), lts: new Date() },
  { name: 'PayStub/ Commission Statement/Cash Payment Records', price: 5, ts: new Date(), lts: new Date() },
  { name: 'Self-Employed Offer', price: 100, ts: new Date(), lts: new Date() },
  { name: 'Payroll Account Closure', price: 0, ts: new Date(), lts: new Date() },
  { name: 'CRA Account Registration—Payroll', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Issue Termination File', price: 100, ts: new Date(), lts: new Date() },
  { name: 'GST/HST Return', price: 150, ts: new Date(), lts: new Date() },
  { name: 'Bookkeeping & Data Review', price: 800, ts: new Date(), lts: new Date() },
  { name: 'Personal Income Tax Review', price: 200, ts: new Date(), lts: new Date() },
  { name: 'WSIB Service', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Personal Income Tax', price: 0, ts: new Date(), lts: new Date() },
  { name: 'HST Return-Quarterly', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Annual Return-Service Fee', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Data Review', price: 300, ts: new Date(), lts: new Date() },
  { name: 'Corporation Income Return', price: 575, ts: new Date(), lts: new Date() },
  { name: 'Annual Return-Gov Fee', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Order Company Key', price: 0, ts: new Date(), lts: new Date() },
  { name: 'Notice of Change', price: 0, ts: new Date(), lts: new Date() }
];

async function seedPayrollServices() {
  console.log('MongoDB URI:', MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@')); // Log masked URI for debugging

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('payrollservices');

    // Check if collection is empty
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Collection is not empty. Found ${existingCount} existing records. Skipping seed.`);
      return;
    }

    // Insert all services
    const result = await collection.insertMany(servicesData);
    console.log(`Successfully seeded ${result.insertedCount} payroll services`);

  } catch (error) {
    console.error('Failed to seed payroll services:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedPayrollServices().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
