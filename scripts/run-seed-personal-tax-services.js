/**
 * Standalone script to seed personal tax services
 * Run with: node scripts/run-seed-personal-tax-services.js
 */

import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tax-work-tracker';
const DB_NAME = 'tax-work-tracker';

const servicesData = [
  { name: 'RC151', price: 60.00, ts: new Date(), lts: new Date() },
  { name: 'Personal Tax Return', price: 65.00, ts: new Date(), lts: new Date() },
  { name: 'T1 Family Tax Return (basic)', price: 130.00, ts: new Date(), lts: new Date() },
  { name: 'Form T2125 (Basic)', price: 90.00, ts: new Date(), lts: new Date() },
  { name: 'T1 Adjustment', price: 60.00, ts: new Date(), lts: new Date() },
  { name: 'Form T776 (AirBnB)', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'Form Schedule 3-basic (sell property)', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Form Schedule 3-Complex (sell property)', price: 150.00, ts: new Date(), lts: new Date() },
  { name: 'Form Schedule 6', price: 10.00, ts: new Date(), lts: new Date() },
  { name: 'Form T1135 (basic)', price: 110.00, ts: new Date(), lts: new Date() },
  { name: 'Form T1135 (Complex)', price: 165.00, ts: new Date(), lts: new Date() },
  { name: 'T5008 (< 5 transactions)', price: 30.00, ts: new Date(), lts: new Date() },
  { name: 'T5008 (transactions above 5)', price: 2.00, ts: new Date(), lts: new Date() },
  { name: 'Form ON-BEN', price: 10.00, ts: new Date(), lts: new Date() },
  { name: 'NR Section 216', price: 150.00, ts: new Date(), lts: new Date() },
  { name: 'NR Representative', price: 250.00, ts: new Date(), lts: new Date() },
  { name: 'NR Service Package (including mail collection)', price: 330.00, ts: new Date(), lts: new Date() },
  { name: 'NR UHT (New Clients)', price: 120.00, ts: new Date(), lts: new Date() },
  { name: 'TIN Application Services', price: 200.00, ts: new Date(), lts: new Date() },
  { name: 'NR Clearance Certificate', price: 1680.00, ts: new Date(), lts: new Date() },
  { name: 'Form Schedule 4 RRSP', price: 6.00, ts: new Date(), lts: new Date() },
  { name: 'Personal Tax Return (complex)', price: 200.00, ts: new Date(), lts: new Date() },
  { name: 'T2200 FORM &T777', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Personal Tax Return', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Authorized Representative', price: 50.00, ts: new Date(), lts: new Date() },
  { name: 'Day Care Expense', price: 20.00, ts: new Date(), lts: new Date() },
  { name: 'T777 FORM', price: 100.00, ts: new Date(), lts: new Date() },
  { name: 'Form T2125 (Including HST Return)', price: 300.00, ts: new Date(), lts: new Date() },
  { name: 'T2091 & S3', price: 60.00, ts: new Date(), lts: new Date() },
  { name: 'RC66 FORM RRSP', price: 150.00, ts: new Date(), lts: new Date() }
];

async function seedPersonalTaxServices() {
  console.log('MongoDB URI:', MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@')); // Log masked URI for debugging

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('personaltaxservices');

    // Check if collection is empty
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Collection is not empty. Found ${existingCount} existing records. Skipping seed.`);
      return;
    }

    // Insert all services
    const result = await collection.insertMany(servicesData);
    console.log(`Successfully seeded ${result.insertedCount} personal tax services`);

  } catch (error) {
    console.error('Failed to seed personal tax services:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedPersonalTaxServices().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
